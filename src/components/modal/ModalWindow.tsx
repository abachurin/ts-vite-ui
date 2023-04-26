import { css, keyframes, SerializedStyles } from "@emotion/react";
import ReactDOM from "react-dom";
import React, {
    useState,
    useMemo,
    forwardRef,
    useImperativeHandle,
    useCallback,
    ReactNode,
    cloneElement,
    ReactElement,
} from "react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";
import CloseButton from "../base/CloseButton";

// Emotion styles
const makeBaseContainer = (
    ContainerBackgroundColor: string
): SerializedStyles => css`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    transform: scale(0);
    background: ${ContainerBackgroundColor};
    z-index: 100;
`;
const backgroundStyle = css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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
    max-height: 78%;
    z-index: 100;
`;

/**
 * A customizable modal window component that can be opened from a parent component,
 * and closed from inside or by clicking on the background
 * @param ContainerBackgroundColor - The background color of the modal container.
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
    ContainerBackgroundColor?: string;
    ModalBackgroundColor?: string;
    color?: string;
    width?: string;
    height?: string;
}
export interface ModalWindowRef {
    open: () => () => void;
    close: () => () => void;
}
const ModalWindow = forwardRef(
    (
        {
            ContainerBackgroundColor = GLOBAL.backgrounds.blur,
            ModalBackgroundColor = GLOBAL.colors.white,
            color = "black",
            width = "auto",
            height = "auto",
            children,
        }: ModalWindowProps,
        ref
    ) => {
        const baseContainer = useMemo(
            () => makeBaseContainer(ContainerBackgroundColor),
            [ContainerBackgroundColor]
        );
        const baseModal = useMemo(
            () => makeBaseModal(ModalBackgroundColor, color, width, height),
            [ModalBackgroundColor, color, width, height]
        );

        const [show, setShow] = useState<boolean | "none">("none");
        const closeModal = () => {
            setShow(false);
        };
        const openModal = () => {
            setShow(true);
        };

        useImperativeHandle(ref, () => ({
            open: () => openModal(),
            close: () => closeModal(),
        }));

        let containerStyle;
        let modalStyle;

        // Clone the child element and attach a click listener that closes the modal,
        // if the child is a React Component and has 'alsoCloseModal' prop set to true.
        const renderChild = useCallback((child: ReactNode): ReactNode => {
            if (
                React.isValidElement(child) &&
                Object.prototype.hasOwnProperty.call(
                    child.props,
                    "alsoCloseModal"
                ) &&
                child.props.alsoCloseModal
            ) {
                return cloneElement(child as ReactElement, {
                    onClick: () => {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                child.props,
                                "onClick"
                            )
                        ) {
                            child.props.onClick();
                        }
                        closeModal();
                    },
                });
            }
            return child;
        }, []);

        if (show) {
            containerStyle = css`
                ${baseContainer};
                transform: scaleY(0.01) scaleX(0);
                animation: ${unFold} 1s cubic-bezier(0.165, 0.84, 0.44, 1)
                    forwards;
            `;
            modalStyle = css`
                ${baseModal};
                transform: scale(0);
                animation: ${zoom} 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)
                    forwards;
            `;
        } else {
            containerStyle = css`
                ${baseContainer};
                transform: scale(1);
                animation: ${fold} 0.5s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)
                    forwards;
            `;
            modalStyle = css`
                ${baseModal};
                animation: ${unZoom} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
                    forwards;
            `;
        }

        if (show === "none") return null;

        return ReactDOM.createPortal(
            <div css={containerStyle}>
                <div onClick={closeModal} css={backgroundStyle}></div>
                <div css={modalStyle}>
                    {<CloseButton onClick={closeModal} />}
                    {React.Children.map(children, renderChild)}
                </div>
            </div>,
            document.getElementById("modal") as HTMLElement
        );
    }
);

export default ModalWindow;
