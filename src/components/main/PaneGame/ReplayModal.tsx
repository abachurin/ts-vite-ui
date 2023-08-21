import { css, SerializedStyles } from "@emotion/react";
import { useState } from "react";
import useModeStore from "../../../store/modeStore";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import useGameStore from "../../../store/gameStore";
import { getItems, getFullGame } from "../../../api/utils";
import { GameDict, AlignProps, GameBackend } from "../../../types";
import { GLOBAL } from "../../../utils";
import useAlertMessage from "../../../hooks/useAlertMessage";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Dropdown from "../../base/Dropdown";
import Button from "../../base/Button/Button";
import CloseButton from "../../base/Button/CloseButton";

// Emotion styles
const makeEmotion = (lines: number): SerializedStyles => css`
    // height: calc(${lines} * 2.2rem + 3.7rem + ${GLOBAL.padding} * 2);
    gap: ${GLOBAL.padding};
    padding: ${GLOBAL.padding};
`;

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const ReplayModal = ({ align }: AlignProps) => {
    const user = useUser();
    const palette = usePalette();

    const assignGame = useGameStore((state) => state.assignGame);
    const restartGame = useGameStore((state) => state.restartGame);
    const setPaused = useGameStore((state) => state.setPaused);

    const setGameMode = useModeStore((state) => state.setGameMode);
    const setGameName = useModeStore((state) => state.setGameName);

    const [item, setItem] = useState("My current game");
    const [options, setOptions] = useState<GameDict>({});
    const choiceOptions = ["Current game", ...Object.keys(options)];

    const [msg, createMsg] = useAlertMessage("");

    const getGames = async () => {
        const { list, message } = await getItems("Games", user.name, "all");
        if (message) {
            createMsg(message, "error");
            return;
        }
        setOptions(list as GameDict);
    };

    const replay = async () => {
        if (item !== "Current game") {
            const { game, status } = await getFullGame(item);
            if (status) {
                createMsg(status, "error");
                return;
            }
            assignGame(game as GameBackend);
        } else restartGame();
        setPaused(false);
        setGameName(item);
        setGameMode("replay");
    };

    const emotion = makeEmotion(choiceOptions.length);

    return (
        <Modal
            button={{
                background: palette.one,
                align: align,
                onClick: getGames,
                children: "Replay",
            }}
            modal={{
                backgroundColor: palette.background,
                color: palette.text,
                width: "24rem",
            }}
        >
            <ModalBody overflow='visible'>
                <div css={emotion}>
                    <Dropdown
                        label='Choose a Game to replay'
                        backgroundColor='white'
                        labelColor1={palette.two}
                        labelColor2={palette.one}
                        alignOptions='right'
                        controlColor={palette.three}
                        optionValues={choiceOptions}
                        initialValue={item}
                        persistAs='replay-game'
                        onChange={setItem}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    background={palette.three}
                    color={palette.background}
                    type='clickPress'
                    onClick={replay}
                    toggleModal={false}
                >
                    Replay
                </Button>
                <CloseButton />
            </ModalFooter>
            {msg ? <ModalFooter>{msg}</ModalFooter> : null}
        </Modal>
    );
};

export default ReplayModal;
