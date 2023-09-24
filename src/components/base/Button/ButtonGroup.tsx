import { css } from "@emotion/react";
import { Children, ReactElement, cloneElement } from "react";
import { ChildrenProps } from "../../../types";
import { GLOBAL } from "../../../utils/utils";

// Emotion styles
const emotion = css`
    display: flex;
    width: fit-content;
    height: fit-content;
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    background: 
    margin-block: auto;
    :hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
`;

/**
 * Returns a group of buttons with customizable styles.
 * @param width - width of each button
 * @param height - height of each button.
 * @param children - individual buttons to render in the group
 */
type ButtonGroupProps = ChildrenProps & {
    width?: string;
    height?: string;
};
const ButtonGroup = ({
    width = "",
    height = "",
    children,
}: ButtonGroupProps) => {
    return (
        <div css={emotion}>
            {Children.map(children, (button, idx) => {
                const borderRadius =
                    idx === 0
                        ? `${GLOBAL.borderRadius} 0 0 ${GLOBAL.borderRadius}`
                        : idx === Children.count(children) - 1
                        ? `0 ${GLOBAL.borderRadius} ${GLOBAL.borderRadius} 0`
                        : "0";
                return cloneElement(button as ReactElement, {
                    borderRadius,
                    width: width || "auto",
                    height: height || "auto",
                });
            })}
        </div>
    );
};

export default ButtonGroup;
