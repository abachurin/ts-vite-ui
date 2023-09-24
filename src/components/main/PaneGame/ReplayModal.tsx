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
import { GLOBAL, simulateCloseModalClick } from "../../../utils/utils";
import useAlertMessage from "../../../hooks/useAlertMessage";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Dropdown from "../../base/Dropdown";
import Button from "../../base/Button/Button";
import CloseButton from "../../base/Button/CloseButton";
import Cube from "../../base/Cube";

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

    const setGameMode = useModeStore((state) => state.setGameMode);
    const setGameName = useModeStore((state) => state.setGameName);

    const assignGame = useGameStore((state) => state.assignGame);
    const restartGame = useGameStore((state) => state.restartGame);
    const setPaused = useGameStore((state) => state.setPaused);

    const [item, setItem] = useState("Current game");
    const [options, setOptions] = useState<GameDict>({});
    const choiceOptions = ["Current game", ...Object.keys(options)];

    const { message, createMessage } = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const getGames = async () => {
        setPaused(true);
        const { list, message } = await getItems("Games", userName, "all");
        if (message) {
            createMessage(message, "error");
            return;
        }
        setOptions(list as GameDict);
    };

    const replay = async () => {
        setLoading(true);
        if (item !== "Current game") {
            const { game, status } = await getFullGame(item);
            if (status) {
                createMessage(status, "error");
                setLoading(false);
                return;
            }
            assignGame(game as GameBackend);
        } else restartGame();
        setPaused(false);
        setGameName(item);
        setGameMode("replay");
        simulateCloseModalClick();
        setLoading(false);
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
                        onChange={setItem}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    background={palette.three}
                    color={palette.background}
                    type='clickPress'
                    disabled={loading}
                    onClick={replay}
                >
                    Replay
                </Button>
                <CloseButton />
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
            {loading ? <Cube /> : null}
        </Modal>
    );
};

export default ReplayModal;
