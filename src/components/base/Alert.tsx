import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";
import CloseButton from "./Button/CloseButton";
import dragMe from "../HOC/Draggable";

// Emotion styles
const makeEmotion = (backgroundColor: string): SerializedStyles => css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${GLOBAL.padding};
    padding-left: calc(${GLOBAL.padding} * 2);
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    background-color: ${backgroundColor};
`;
interface AlertProps extends ChildrenProps {
    isOpen?: boolean;
    bad?: boolean;
}
const StaticAlert = ({ isOpen = false, bad = true, children }: AlertProps) => {
    const [show, setShow] = useState(isOpen);
    useEffect(() => setShow(isOpen), [isOpen]);

    const palette = usePalette();
    const backgroundColor = bad ? palette.one : palette.two;

    const emotion = useMemo(
        () => makeEmotion(backgroundColor),
        [backgroundColor]
    );
    if (!show) return null;

    return (
        <div css={emotion}>
            {children}
            <CloseButton onClick={() => setShow(false)} />
        </div>
    );
};

const Alert = dragMe(StaticAlert);

export default Alert;
