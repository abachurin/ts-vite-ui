import { css, keyframes, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import {
    usePalette,
    useAnimate,
} from "../../contexts/UserProvider/UserContext";
import { ChildrenProps, AlertColors } from "../../types";
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
        background: linear-gradient(135deg, ${borderColor}, ${backgroundColor});
        color: ${color};
    `;

export interface AlertProps extends ChildrenProps {
    type?: AlertColors;
    closeAlert: () => void;
}
const StaticAlert = ({
    type = "warning",
    closeAlert,
    children,
}: AlertProps) => {
    const animate = useAnimate();
    const palette = usePalette();
    const borderColor =
        type === "error" || type === "warning"
            ? palette.error
            : palette.success;

    const emotion = useMemo(
        () => css`
            ${makeEmotion(borderColor, palette.text, palette.background)}
            ${animate ? animation : null},
        `,
        [borderColor, palette, animate]
    );

    return (
        <div css={emotion}>
            {children || "Lo! Behold!"}
            <CloseButton onClick={closeAlert} toggleModal={"none"} />
        </div>
    );
};

export default StaticAlert;
