import { css, keyframes, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import {
    usePalette,
    useAnimate,
} from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";
import CloseButton from "./Button/CloseButton";
import dragMe from "../HOC/Draggable";

// Emotion styles
const zoom = keyframes`
    0% {
        transform:scale(0);
    }
    100% {
        transform:scale(1);
    }
`;
const animation = css`
    animation: ${zoom} 0.3s ease-in-out;
`;
const makeEmotion = (
    borderColor: string,
    backgroundColor: string,
    color: string
): SerializedStyles =>
    css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: ${GLOBAL.padding};
        padding: ${GLOBAL.padding};
        padding-left: calc(${GLOBAL.padding} * 2);
        border-radius: ${GLOBAL.borderRadius};
        box-shadow: ${GLOBAL.insetShadow(borderColor)};
        background-color: ${backgroundColor};
        color: ${color};
    `;

interface AlertProps extends ChildrenProps {
    bad?: boolean;
    duration?: number;
}
const StaticAlert = ({
    bad = true,
    // duration = GLOBAL.messageDuration,
    duration = 0,
    children,
}: AlertProps) => {
    const animate = useAnimate();
    const palette = usePalette();
    const borderColor = bad ? palette.error : palette.success;

    const emotion = useMemo(
        () => css`
            ${makeEmotion(borderColor, palette.background, palette.text)}
            ${animate ? animation : null},
        `,
        [borderColor, palette, animate]
    );

    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (duration && isOpen) {
            const timeout = setTimeout(() => {
                setIsOpen(false);
            }, duration);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [duration, isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div css={emotion}>
            {children}
            <CloseButton
                onClick={() => setIsOpen(false)}
                toggleModal={"none"}
            />
        </div>
    );
};

const Alert = dragMe(StaticAlert);

export default Alert;
