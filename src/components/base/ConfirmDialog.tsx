import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useEffect, useCallback } from "react";
import {
    usePalette,
    useSoundVolume,
} from "../../contexts/UserProvider/UserContext";
import { GLOBAL, makeSound } from "../../utils";
import Button from "./Button/Button";
import dragMe from "../HOC/Draggable";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const makeWrapper = (isOpen: boolean): SerializedStyles => css`
    z-index: 10;
    & > header {
        position: fixed;
        top: -100vh;
        left: -100vw;
        width: 300vw;
        height: 300vh;
        background-color: rgba(0, 0, 0, 0.01);
        visibility: ${isOpen ? "visible" : "hidden"};
    }
    & > main {
        position: fixed;
        top: 25%;
        left: 50%;
        transform: ${isOpen ? "scale(1)" : "scale(0)"};
    }
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

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void;
    onCancel: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => void;
}
const StaticConfirmDialog = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    const palette = usePalette();
    const volume = useSoundVolume();

    const escapeHandler = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen === true) {
                makeSound(clickSound, volume);
                onCancel(e);
            }
        },
        [onCancel, isOpen, volume]
    );

    useEffect(() => {
        document.addEventListener("keydown", escapeHandler);
        return () => {
            document.removeEventListener("keydown", escapeHandler);
        };
    }, [escapeHandler]);

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
                    onClick={onConfirm}
                >
                    Ok
                </Button>
                <Button
                    type='clickPress'
                    width='5em'
                    background={palette.four}
                    color={palette.background}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </footer>
        </main>
    );
};

const DraggableConfirmDialog = dragMe(
    StaticConfirmDialog,
    { x: "0px", y: "-100px" },
    "fixed"
);

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const wrapper = makeWrapper(props.isOpen);

    return (
        <div css={wrapper}>
            <header />
            <main>
                <DraggableConfirmDialog {...props} />
            </main>
        </div>
    );
};

export default ConfirmDialog;
