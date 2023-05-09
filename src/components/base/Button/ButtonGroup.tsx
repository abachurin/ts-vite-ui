import { css } from "@emotion/react";
import React, {
    useState,
    Children,
    ReactNode,
    ReactElement,
    cloneElement,
} from "react";
import { ChildrenProps } from "../../../types";
import { GLOBAL } from "../../../utils";

// Emotion styles
const emotion = css`
    display: flex;
`;

/**
 * A React component that renders a group of buttons with customizable styles.
 * @param width - The width of each button
 * @param height - The height of each button.
 * @param lastClickColor - The outline color of the last clicked button.
 * @param children - The individual buttons to render.
 */
interface ButtonGroupProps extends ChildrenProps {
    width?: string;
    height?: string;
    lastClickColor?: string;
}
const ButtonGroup = ({
    width = "",
    height = "",
    lastClickColor = "",
    children,
}: ButtonGroupProps) => {
    const lastIdx = Children.count(children) - 1;

    const renderChild = (
        child: ReactNode,
        idx: number,
        lastIdx: number
    ): ReactNode => {
        const borderRadius =
            idx === 0
                ? `${GLOBAL.borderRadius} 0 0 ${GLOBAL.borderRadius}`
                : idx === lastIdx
                ? `0 ${GLOBAL.borderRadius} ${GLOBAL.borderRadius} 0`
                : "0";
        return cloneElement(child as ReactElement, {
            borderRadius: borderRadius,
            width: width || "auto",
            height: height || "auto",
        });
    };

    return (
        <div css={emotion}>
            {React.Children.map(children, (button, idx) =>
                renderChild(button, idx, lastIdx)
            )}
        </div>
    );
};

export default ButtonGroup;
