import { css } from "@emotion/react";
import React, {
    Children,
    ReactNode,
    ReactElement,
    cloneElement,
    useCallback,
} from "react";
import { ChildrenProps } from "../../../types";
import { GLOBAL } from "../../../utils";

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
 * A React component that renders a group of buttons with customizable styles.
 * @param width - The width of each button
 * @param height - The height of each button.
 * @param children - The individual buttons to render.
 */
interface ButtonGroupProps extends ChildrenProps {
    width?: string;
    height?: string;
}
const ButtonGroup = ({
    width = "",
    height = "",
    children,
}: ButtonGroupProps) => {
    const lastIdx = Children.count(children) - 1;

    const renderChild = useCallback(
        (child: ReactNode, idx: number): ReactNode => {
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
        },
        [width, height, lastIdx]
    );

    return (
        <div css={emotion}>
            {React.Children.map(children, (button, idx) =>
                renderChild(button, idx)
            )}
        </div>
    );
};

export default ButtonGroup;
