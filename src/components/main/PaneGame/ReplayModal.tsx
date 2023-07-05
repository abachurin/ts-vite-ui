import { css, SerializedStyles } from "@emotion/react";
import { useState } from "react";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import { connectAPI } from "../../../api/utils";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { GameDict, ItemListRequest, AlignProps } from "../../../types";
import { GLOBAL } from "../../../utils";
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
    const modeUpdate = useModeUpdate();
    const user = useUser();
    const palette = usePalette();

    const [item, setItem] = useState("My current game");
    const [options, setOptions] = useState<GameDict>({});
    const choiceOptions = ["My current game", ...Object.keys(options)];

    const [message, createMessage] = useAlertMessage("");

    const getGames = async () => {
        const { result, error } = await connectAPI<
            ItemListRequest,
            GameListResponse
        >({
            method: "POST",
            endpoint: "/games/list",
            data: { userName: user.name, scope: "all" },
        });
        if (result !== undefined) {
            if (result.status === "ok") {
                setOptions(result.list ?? {});
            } else {
                createMessage(result.status, "error");
            }
        } else {
            createMessage(error ?? "Unknown error", "error");
        }
    };

    // modeUpdate({ game: "replay" })

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
                    onClick={() => console.log(item)}
                    toggleModal={false}
                >
                    Replay
                </Button>
                <CloseButton />
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
        </Modal>
    );
};

export default ReplayModal;
