import { css, SerializedStyles } from "@emotion/react";
import { useState } from "react";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import useGameStore from "../../../store/gameStore";
import { getItems, getFullGame } from "../../../api/utils";
import { AgentDict, AlignProps, GameBackend } from "../../../types";
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
const WatchModal = ({ align }: AlignProps) => {
    const modeUpdate = useModeUpdate();
    const assignGame = useGameStore((state) => state.assignGame);
    const user = useUser();
    const palette = usePalette();

    const [item, setItem] = useState("My current game");
    const [options, setOptions] = useState<AgentDict>({});
    const choiceOptions = [
        "Random Moves",
        "Best Score",
        ...Object.keys(options),
    ];

    const [msg, createMsg] = useAlertMessage("");

    const getAgents = async () => {
        const { list, message } = await getItems("Agents", user.name, "all");
        if (message) {
            createMsg(message, "error");
            return;
        }
        setOptions(list as AgentDict);
    };

    const watch = async () => {
        const { game, status } = await getFullGame(item);
        if (status) {
            createMsg(status, "error");
            return;
        }
        assignGame(game as GameBackend);

        modeUpdate({ game: "replay" });
    };

    const emotion = makeEmotion(choiceOptions.length);

    return (
        <Modal
            button={{
                background: palette.one,
                align: align,
                onClick: getAgents,
                children: "Watch",
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
                        label='Choose Agent to Watch'
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
                    onClick={watch}
                    toggleModal={false}
                >
                    Watch Agent Play
                </Button>
                <CloseButton />
            </ModalFooter>
            {msg ? <ModalFooter>{msg}</ModalFooter> : null}
        </Modal>
    );
};

export default WatchModal;
