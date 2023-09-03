import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { connectAPI, getJustNames } from "../../../api/requests";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useModeStore from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { AgentWatchingBase } from "../../../types";
import {
    GLOBAL,
    defaultWatchParams,
    simulateCloseModalClick,
    validateTestingParams,
    specialAgents,
    randomName,
} from "../../../utils";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Input from "../../base/Input";
import Radio from "../../base/Radio";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import CloseButton from "../../base/Button/CloseButton";
import GameLogic from "../../../store/gameLogic";
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

/**
 * Watch Agent modal
 */
const WatchModal = () => {
    const palette = usePalette();

    const { setGameMode, setGameName } = useModeStore();
    const {
        game,
        watchUser,
        setWatchUser,
        setPaused,
        setWatchingNow,
        loadingWeights,
        setLoadingWeights,
        cutHistory,
        newGame,
    } = useGameStore();

    useEffect(() => {
        if (loadingWeights === false) {
            createMessage("");
            simulateCloseModalClick();
        }
    }, [loadingWeights]);

    const [message, createMessage] = useAlertMessage("");

    const [agents, setAgents] = useState<string[]>([]);
    const getAllAgentNames = async () => {
        setPaused(true);
        const { list, message } = await getJustNames("Agents", "", "all");
        createMessage(message, "error");
        setAgents(list);
    };

    const [values, setValues] = useState<AgentWatchingBase>(defaultWatchParams);
    const [isNew, setIsNew] = useState(true);
    const updateValues = useCallback((update: Partial<AgentWatching>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const handleWatch = async () => {
        if (!isNew && GameLogic.gameOver(game)) {
            createMessage(
                "The Game is already over, no way to continue.",
                "error"
            );
            return;
        }
        const [validated, change] = validateTestingParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));
        if (change) {
            createMessage(
                "Some parameters are invalid or undefined. Please follow the instructions.",
                "error"
            );
            return;
        }

        const newWatchUser = randomName("agent");
        setWatchUser(newWatchUser);
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
                setWatchingNow(true);
                setPaused(false);
            }
        }
    };

    const handleResetDefaults = () => {
        const resetValues = { ...defaultWatchParams };
        resetValues.name = values.name;
        setValues(resetValues);
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
                        persistAs='train-existing-name'
                        initialValue={values.name}
                        onChange={(value) =>
                            updateValues({ name: String(value) })
                        }
                        zIndex={30}
                    />
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Depth'
                            initialValue={values.depth}
                            persistAs='test-depth'
                            min={0}
                            max={2}
                            step={1}
                            placeholder='0 <= depth <= 2'
                            onChange={(value) =>
                                updateValues({
                                    depth:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Width'
                            initialValue={values.width}
                            persistAs='test-width'
                            min={0}
                            max={3}
                            step={1}
                            placeholder='0 <= width <= 3'
                            onChange={(value) =>
                                updateValues({
                                    width:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Trigger'
                            initialValue={values.trigger}
                            persistAs='test-trigger'
                            min={0}
                            max={6}
                            step={1}
                            placeholder='0 <= trigger <= 6'
                            onChange={(value) =>
                                updateValues({
                                    trigger:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
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
