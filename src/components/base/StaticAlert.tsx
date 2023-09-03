import { css, keyframes } from "@emotion/react";
import { useMemo } from "react";
import {
    usePalette,
    useAnimate,
} from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { paletteAlertType } from "../../palette";
import { GLOBAL } from "../../utils";
import CloseButton from "./Button/CloseButton";

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
) =>
    css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: ${GLOBAL.padding};
        padding: ${GLOBAL.padding};
        padding-left: calc(${GLOBAL.padding} * 2);
        border-radius: ${GLOBAL.borderRadius};
        box-shadow: ${GLOBAL.insetShadow(borderColor, 0.1)};
        background: linear-gradient(135deg, ${borderColor}, ${backgroundColor});
        color: ${color};
    `;

/**
 * Static alert component with customizable type and Close button
 * @param type - type
 * @param closeAlert - callback function to execute upon closing the alert
 * @param children - content to be rendered inside
 */
export type AlertProps = ChildrenProps & {
    type?: paletteAlertType;
    closeAlert: () => void;
};
const StaticAlert = ({ type = "info", closeAlert, children }: AlertProps) => {
    const animate = useAnimate();
    const palette = usePalette();

    const emotion = useMemo(
        () => css`
            ${makeEmotion(palette[type], palette.text, palette.background)}
            ${animate ? animation : ""},
        `,
        [type, palette, animate]
    );

    if (!children) return null;

    return (
        <div css={emotion}>
            {children}
            <CloseButton onClick={closeAlert} toggleModal={"none"} />
        </div>
    );
};

export default StaticAlert;
