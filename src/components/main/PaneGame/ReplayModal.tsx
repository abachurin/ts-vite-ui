import { css } from "@emotion/react";
import { useState } from "react";
import useModeStore from "../../../store/modeStore";
import {
    usePalette,
    useUserName,
} from "../../../contexts/UserProvider/UserContext";
import useGameStore from "../../../store/gameStore";
import { getItems, getFullGame } from "../../../api/requests";
import { GameDict, GameBackend } from "../../../types";
import { GLOBAL } from "../../../utils";
import useAlertMessage from "../../../hooks/useAlertMessage";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Dropdown from "../../base/Dropdown";
import Button from "../../base/Button/Button";
import CloseButton from "../../base/Button/CloseButton";

// Emotion styles
const emotion = css`
    gap: ${GLOBAL.padding};
    padding: ${GLOBAL.padding};
`;

/**
 * Replay Game modal.
 */
const ReplayModal = () => {
    const userName = useUserName();
    const palette = usePalette();

    const { assignGame, restartGame, setPaused } = useGameStore();
    const { setGameMode, setGameName } = useModeStore();

    const [item, setItem] = useState("My current game");
    const [options, setOptions] = useState<GameDict>({});
    const choiceOptions = ["Current game", ...Object.keys(options)];

    const [msg, createMsg] = useAlertMessage("");

    const getGames = async () => {
        setPaused(true);
        const { list, message } = await getItems("Games", userName, "all");
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

    return (
        <Modal
            button={{
                background: palette.one,
                onClick: getGames,
                children: "Replay",
            }}
            modal={{
                backgroundColor: palette.background,
                color: palette.text,
                width: "20rem",
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
