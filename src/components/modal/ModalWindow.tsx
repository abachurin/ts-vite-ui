import { css, keyframes } from "@emotion/react";
import ReactDOM from "react-dom";
import { useCallback, useEffect } from "react";
import {
    useModal,
    useModalUpdate,
} from "../../contexts/ModalProvider/ModalContext";
import {
    useSoundVolume,
    useAnimate,
} from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL, makeSound } from "../../utils/utils";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const unFold = keyframes`
    0% {
        transform: scaleY(0.005) scaleX(0);
    }
    50% {
        transform: scaleY(0.005) scaleX(1);
    }
    100% {
        transform: scaleY(1) scaleX(1);
    }
`;
const fold = keyframes`
    0% {
        transform:scaleY(1) scaleX(1);
    }
    50% {
        transform:scaleY(.005) scaleX(1);
    }
    100% {
        transform:scaleY(.005) scaleX(0);
    }
`;
const zoom = keyframes`
    0% {
        transform:scale(0);
    }
    100% {
        transform:scale(1);
    }
`;
const unZoom = keyframes`
    0% {
        transform:scale(1);
    }
    100% {
        transform:scale(0);
    }
`;
const makeContainer = (isOpen: boolean, animate: boolean) => css`
    position: fixed;
    display: ${isOpen || animate ? "flex" : "none"};
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    transform: scale(0);
    background: rgba(255, 255, 255, 0.1);
    z-index: 100;
    transform: ${isOpen
        ? animate
            ? "scaleY(0.01) scaleX(0)"
            : "scale(1)"
        : animate && "scale(1)"};
    animation: ${animate &&
    (isOpen
        ? css`
              ${unFold} 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards
          `
        : css`
              ${fold} 0.5s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards
          `)};
`;
const makeBlock = (isOpen: boolean) => css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.001);
    z-index: 50;
    transform: ${isOpen ? "scale(1)" : "scale(0)"};
`;
const background = css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
`;
const makeContent = (
    backgroundColor: string,
    color: string,
    width: string,
    height: string,
    isOpen: boolean,
    animate: boolean
) => css`
    display: ${isOpen || animate ? "flex" : "none"};
    flex-direction: column;
    position: relative;
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    background: ${backgroundColor};
    color: ${color};
    width: ${width};
    height: ${height};
    max-height: 90%;
    z-index: 300;
    transform: ${animate ? "scale(0)" : "scale(1)"};
    animation: ${animate &&
    (isOpen
        ? css`
              ${zoom} 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
          `
        : css`
              ${unZoom} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
          `)};
`;

/**
 * A customizable modal window component that can be opened from a parent component,
 * and closed from inside or by clicking on the background.
 * @param backgroundColor - background color of the modal content.
 * @param color - text color
 * @param width - width of the modal content
 * @param height - height of the modal content
 * @param children - The child elements to be displayed inside the modal content
 * ModalHeader, ModalBody and ModalFooter components are available
 * All are optional, but the content is recommended to wrap in ModalBody as it controls overflow
 * @param onClose - callback function to execute when the modal is closed
 * @returns A portal to render the modal outside of the main React tree,
 * including a container with a background overlay and a modal content area.
 */
export type ModalWindowProps = ChildrenProps & {
    backgroundColor?: string;
    color?: string;
    width?: string;
    height?: string;
    onClose?: () => void;
};
const ModalWindow = ({
    backgroundColor = "white",
    color = "black",
    width = "auto",
    height = "auto",
    children,
    onClose,
}: ModalWindowProps) => {
    const isOpen = useModal();
    const updateIsOpen = useModalUpdate();
    const volume = useSoundVolume();
    const animate = useAnimate();

    const closeModal = useCallback(() => {
        onClose && onClose();
        makeSound(clickSound, volume);
        updateIsOpen(false);
    }, [volume, updateIsOpen, onClose]);

    const escapeHandler = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen === true) {
                makeSound(clickSound, volume);
                closeModal();
            }
        },
        [isOpen, volume, closeModal]
    );

    useEffect(() => {
        document.addEventListener("keydown", escapeHandler);
        return () => {
            document.removeEventListener("keydown", escapeHandler);
        };
    }, [escapeHandler]);

    if (isOpen === "none") return null;

    const container = makeContainer(isOpen, animate);
    const block = makeBlock(isOpen);
    const content = makeContent(
        backgroundColor,
        color,
        width,
        height,
        isOpen,
        animate
    );

    return ReactDOM.createPortal(
        <>
            <div css={block}></div>
            <div css={container}>
                <div onClick={closeModal} id='modal-close' css={background} />
                <main css={content}>{children}</main>
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    );
};

export default ModalWindow;
