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
    state?: { isOpen: boolean };
    bad?: boolean;
    duration?: number;
}
const StaticAlert = ({
    state = { isOpen: false },
    bad = true,
    duration = 5000,
    children,
}: AlertProps) => {
    const [show, setShow] = useState(state["isOpen"]);
    useEffect(() => setShow(state["isOpen"]), [state]);
    if (show) {
        setTimeout(() => setShow(false), duration);
    }

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
