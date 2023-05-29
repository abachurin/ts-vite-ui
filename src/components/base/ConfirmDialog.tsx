import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../utils";
import Button from "./Button/Button";
import dragMe from "../HOC/Draggable";

// Emotion styles
const makeBlock = (isOpen: boolean): SerializedStyles => css`
    position: fixed;
    top: -100vh;
    left: -100vw;
    width: 300vw;
    height: 300vh;
    background-color: rgba(0, 0, 0, 0.01);
    visibility: ${isOpen ? "visible" : "hidden"};
`;
const makeEmotion = (
    textColor: string,
    borderColor: string,
    isOpen: boolean
): SerializedStyles => css`
    min-width: 20rem;
    display: flex;
    flex-direction: column;
    gap: calc(${GLOBAL.padding} * 2);
    background-color: white;
    color: ${textColor};
    padding: calc(${GLOBAL.padding} * 2);
    border-radius: ${GLOBAL.borderRadius};
    border: 2px solid ${borderColor};
    box-shadow: ${GLOBAL.littleShadow};
    opacity: ${isOpen ? 1 : 0};
    transform: ${isOpen ? "scale(1)" : "scale(0)"};
    transition: all 0.25s ease-in-out;
    & p {
        text-align: center;
    }
    & footer {
        display: flex;
        gap: calc(${GLOBAL.padding} * 2);
        justify-content: space-evenly;
        align-items: center;
    }
`;
const makeWrapper = (isOpen: boolean): SerializedStyles => css`
    position: fixed;
    top: 25%;
    left: 50%;
    transform: ${isOpen ? "scale(1)" : "scale(0)"};
`;

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const StaticConfirmDialog = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    const palette = usePalette();
    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        onConfirm !== undefined && onConfirm(e);
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        onCancel !== undefined && onCancel(e);
    };

    const emotion = useMemo(
        () => makeEmotion(palette.text, palette.text, isOpen),
        [palette, isOpen]
    );

    return (
        <main css={emotion}>
            <p>{message}</p>
            <footer>
                <Button
                    type='clickPress'
                    width='5em'
                    background={palette.three}
                    color={palette.background}
                    onClick={handleConfirm}
                >
                    Ok
                </Button>
                <Button
                    type='clickPress'
                    width='5em'
                    background={palette.four}
                    color={palette.background}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </footer>
        </main>
    );
};

const DraggableConfirmDialog = dragMe(
    StaticConfirmDialog,
    { x: "0", y: "0" },
    "fixed"
);

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const block = makeBlock(props.isOpen);
    const wrapper = makeWrapper(props.isOpen);

    return (
        <>
            <div css={block} />
            <div css={wrapper}>
                <DraggableConfirmDialog {...props} />
            </div>
        </>
    );
};

export default ConfirmDialog;
