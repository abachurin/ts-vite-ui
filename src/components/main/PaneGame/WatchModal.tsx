import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { connectAPI, getJustNames } from "../../../api/requests";
import {
    usePalette,
    useUserName,
} from "../../../contexts/UserProvider/UserContext";
import useModeStore from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { AgentWatchingBase } from "../../../types";
import {
    GLOBAL,
    simulateCloseModalClick,
    specialAgents,
    randomName,
    startUpperCase,
} from "../../../utils/utils";
import {
    defaultWatchParams,
    validateTestParams,
    undefinedWatchParams,
    watchParamConstraints,
    inputToNumber,
} from "../../../utils/validation";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Input from "../../base/Input";
import Radio from "../../base/Radio";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import CloseButton from "../../base/Button/CloseButton";
import GameLogic from "../../../gameLogic";
import Cube from "../../base/Cube";

// Emotion styles
const footerWrapper = css`
    flex: 1;
    display: flex;
    justify-content: space-between;
`;
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-block: calc(${GLOBAL.padding} * 2);
    padding-inline: ${GLOBAL.padding};
    & > * {
        flex: 1;
    }
    & > section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${GLOBAL.padding};
    }
    & > section > * {
        flex: 1;
    }
`;

// Helper functions
type GameForWatch = {
    initial: number[][];
    score: number;
    numMoves: number;
};
type AgentWatching = AgentWatchingBase & {
    startGame: GameForWatch;
    previous: string;
};
type NumInput = keyof typeof watchParamConstraints;

/**
 * Watch Agent modal
 */
const WatchModal = () => {
    const userName = useUserName();
    const palette = usePalette();

    const setGameMode = useModeStore((state) => state.setGameMode);
    const setGameName = useModeStore((state) => state.setGameName);

    const game = useGameStore((state) => state.game);
    const watchUser = useGameStore((state) => state.watchUser);
    const setWatchUser = useGameStore((state) => state.setWatchUser);
    const setPaused = useGameStore((state) => state.setPaused);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);
    const loadingWeights = useGameStore((state) => state.loadingWeights);
    const setLoadingWeights = useGameStore((state) => state.setLoadingWeights);
    const cutHistory = useGameStore((state) => state.cutHistory);
    const newGame = useGameStore((state) => state.newGame);

    const { message, createMessage } = useAlertMessage();

    // Close modal and clear message when loadingWeights changes from true to false
    useEffect(() => {
        if (loadingWeights === false) {
            createMessage();
            simulateCloseModalClick();
        }
    }, [loadingWeights, createMessage]);

    const [values, setValues] = useState(undefinedWatchParams);
    const [isNew, setIsNew] = useState(true);
    const updateValues = useCallback((update: Partial<AgentWatching>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    // Reset values for new User
    useEffect(() => {
        setValues(undefinedWatchParams);
    }, [userName]);

    const [agents, setAgents] = useState<string[]>([]);
    const getAllAgentNames = async () => {
        setPaused(true);
        const { list, message } = await getJustNames("Agents", "", "all");
        createMessage(message, "error");
        setAgents(list);
    };

    // Main "GO" function
    const handleWatch = useCallback(async () => {
        if (!isNew && GameLogic.gameOver(game)) {
            createMessage(
                "The Game is already over, no way to continue.",
                "error"
            );
            return;
        }
        const [validated, change] = validateTestParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));
        if (change) {
            createMessage(
                "Some parameters are invalid or undefined. Please follow the instructions.",
                "error"
            );
            return;
        }

        const newWatchUser = randomName("agent");
        setWatchUser("");
        setWatchingNow(false);
        setPaused(true);
        setLoadingWeights(true);

        const row = isNew ? newGame() : game.row;
        if (!isNew) cutHistory();
        const startGame: GameForWatch = isNew
            ? {
                  initial: row,
                  score: 0,
                  numMoves: 0,
              }
            : {
                  initial: game.row,
                  score: game.score,
                  numMoves: game.pointer.move,
              };
        const { result, error } = await connectAPI<AgentWatching, string>({
            method: "post",
            endpoint: "/watch/new_agent",
            data: {
                ...values,
                user: newWatchUser,
                startGame: startGame,
                previous: watchUser,
            },
        });
        if (error) {
            createMessage(error, "error", 5000);
            setTimeout(() => setLoadingWeights(false), 5000);
        } else {
            if (result !== "ok") {
                createMessage(result, "error");
                setTimeout(() => setLoadingWeights(false), 5000);
            } else {
                createMessage(
                    `Initializing ${values.name} ...`,
                    "success",
                    100000
                );
                setGameName(values.name);
                setGameMode("watch");
                setWatchUser(newWatchUser);
                setWatchingNow(true);
                setPaused(false);
            }
        }
    }, [
        isNew,
        game,
        values,
        setWatchUser,
        setWatchingNow,
        setPaused,
        setLoadingWeights,
        newGame,
        cutHistory,
        watchUser,
        createMessage,
        setGameName,
        setGameMode,
    ]);

    // Need to wrap onChange functions for Inputs in Callbacks to avoid infinite re-render loops
    const handleChangeName = useCallback(
        (value: string) => updateValues({ name: value }),
        [updateValues]
    );
    const handleResetDefaults = () => {
        const resetValues = { ...defaultWatchParams };
        resetValues.name = values.name;
        setValues(resetValues);
    };
    const handleChangeNumValue = useCallback(
        (key: NumInput, value: string) =>
            updateValues({ [key]: inputToNumber(value) }),
        [updateValues]
    );
    const handleChangeDepth = useCallback(
        (value: string) => handleChangeNumValue("depth", value),
        [handleChangeNumValue]
    );
    const handleChangeWidth = useCallback(
        (value: string) => handleChangeNumValue("width", value),
        [handleChangeNumValue]
    );
    const handleChangeTrigger = useCallback(
        (value: string) => handleChangeNumValue("trigger", value),
        [handleChangeNumValue]
    );
    const handleChangeNumParams = {
        depth: handleChangeDepth,
        width: handleChangeWidth,
        trigger: handleChangeTrigger,
    };
    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const renderInput = (key: NumInput) => {
        const min = watchParamConstraints[key].min;
        const max = watchParamConstraints[key].max;
        return (
            <Input
                {...inputParameters}
                type='number'
                label={startUpperCase(key)}
                initialValue={values[key]}
                persistAs={`${userName}_watch-${key}`}
                min={min}
                max={max}
                step={watchParamConstraints[key].step}
                placeholder={`${min} <= * <= ${max}`}
                onChange={handleChangeNumParams[key]}
            />
        );
    };

    const allAgents = [...specialAgents, ...agents];

    return (
        <Modal
            button={{
                background: palette.one,
                onClick: getAllAgentNames,
                children: "Watch",
            }}
            modal={{
                width: "26rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalBody overflow='visible'>
                <main css={emotion}>
                    <Dropdown
                        {...inputParameters}
                        label='Choose Agent to Watch'
                        optionValues={allAgents}
                        initialValue={values.name}
                        persistAs={`${userName}_watch-name`}
                        onChange={handleChangeName}
                        zIndex={30}
                    />
                    <section>
                        {renderInput("depth")}
                        {renderInput("width")}
                        {renderInput("trigger")}
                    </section>
                    <Radio
                        backgroundColor={palette.background}
                        controlColor={palette.three}
                        color1={palette.two}
                        color2={palette.one}
                        label={"Start new or continue current Game?"}
                        options={["New", "Continue"]}
                        initialValue={isNew ? "New" : "Continue"}
                        onChange={(value: string) =>
                            setIsNew(value == "New" ? true : false)
                        }
                    />
                </main>
            </ModalBody>
            <ModalFooter>
                <footer css={footerWrapper}>
                    <Button
                        type='clickPress'
                        width='8rem'
                        background={palette.three}
                        color={palette.background}
                        onClick={handleWatch}
                        disabled={loadingWeights}
                    >
                        GO!
                    </Button>
                    <Button
                        type='clickPress'
                        width='8rem'
                        background={palette.two}
                        color={palette.background}
                        onClick={handleResetDefaults}
                        disabled={loadingWeights}
                    >
                        Reset Defaults
                    </Button>
                    <CloseButton />
                </footer>
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
            {loadingWeights ? <Cube /> : null}
        </Modal>
    );
};

export default WatchModal;
