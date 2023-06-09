import { css, keyframes, SerializedStyles } from "@emotion/react";
import ReactDOM from "react-dom";
import { useCallback, useMemo, useEffect } from "react";
import {
    useModal,
    useModalUpdate,
} from "../../contexts/ModalProvider/ModalContext";
import { useUser, useAnimate } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL, makeSound } from "../../utils";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const baseContainer = css`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    transform: scale(0);
    background: rgba(255, 255, 255, 0.1);
    z-index: 100;
`;

const baseBlock = css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.001);
    z-index: 50;
    transform: scale(0);
`;

const backgroundStyle = css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
`;

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

const makeBaseModal = (
    ModalBackgroundColor: string,
    color: string,
    width: string,
    height: string
): SerializedStyles => css`
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    background: ${ModalBackgroundColor};
    color: ${color};
    width: ${width};
    height: ${height};
    max-height: 90%;
    z-index: 300;
`;

/**
 * A customizable modal window component that can be opened from a parent component,
 * and closed from inside or by clicking on the background
 * @param ModalBackgroundColor - The background color of the modal content.
 * @param color - The text color of the modal content.
 * @param width - The width of the modal content.
 * @param height - The height of the modal content.
 * @param children - The child elements to be displayed inside the modal content.
 * ModalHeader, ModalBody and ModalFooter components are available
 * All are optional, but the content is recommended to wrap in ModalBody as it controls overflow.
 * @returns A portal to render the modal outside of the main React tree,
 * including a container with a background overlay and a modal content area.
 */
export interface ModalWindowProps extends ChildrenProps {
    backgroundColor?: string;
    color?: string;
    width?: string;
    height?: string;
}
export interface ModalWindowRef {
    open: () => () => void;
    close: () => () => void;
}
const ModalWindow = ({
    backgroundColor = "white",
    color = "black",
    width = "auto",
    height = "auto",
    children,
}: ModalWindowProps) => {
    const isOpen = useModal();
    const updateIsOpen = useModalUpdate();
    const user = useUser();
    const animate = useAnimate();

    const baseModal = useMemo(
        () => makeBaseModal(backgroundColor, color, width, height),
        [backgroundColor, color, width, height]
    );

    const closeModal = useCallback(() => {
        makeSound(clickSound, user);
        updateIsOpen(false);
    }, [updateIsOpen, user]);

    const escapeHandler = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen === true) {
                makeSound(clickSound, user);
                closeModal();
            }
        },
        [closeModal, isOpen, user]
    );

    useEffect(() => {
        document.addEventListener("keydown", escapeHandler);
        return () => {
            document.removeEventListener("keydown", escapeHandler);
        };
    }, [escapeHandler]);

    if (isOpen === "none") return null;

    // If animation is switched off we just open/close Modal immediately
    const containerStyle = isOpen
        ? animate
            ? css`
                  ${baseContainer}
                  transform: scaleY(0.01) scaleX(0);
                  animation: ${unFold} 1s cubic-bezier(0.165, 0.84, 0.44, 1)
                      forwards;
              `
            : css`
                  ${baseContainer}
                  transform: scale(1);
              `
        : animate
        ? css`
              ${baseContainer}
              transform: scale(1);
              animation: ${fold} 0.5s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)
                  forwards;
          `
        : css`
              display: none;
          `;

    const modalStyle = isOpen
        ? animate
            ? css`
                  ${baseModal}
                  transform: scale(0);
                  animation: ${zoom} 0.5s 0.8s
                      cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
              `
            : css`
                  ${baseModal}
                  transform: scale(1);
              `
        : animate
        ? css`
              ${baseModal}
              animation: ${unZoom} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
            forwards;
          `
        : css`
              display: none;
          `;

    const block = isOpen
        ? baseBlock
        : css`
              ${baseBlock}
              transform: scale(1);
          `;

    return ReactDOM.createPortal(
        <>
            <div css={block}></div>
            <div css={containerStyle}>
                <div
                    onClick={closeModal}
                    id='modal-close'
                    css={backgroundStyle}
                />
                <div css={modalStyle}>{children}</div>
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    );
};

export default ModalWindow;
