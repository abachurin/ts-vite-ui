import { css } from "@emotion/react";
import React, { Children, ReactNode, ReactElement, cloneElement } from "react";
import { ChildrenProps } from "../../../types";
import { GLOBAL } from "../../../utils";

// Emotion styles
const emotion = css`
    display: flex;
`;

// Helper functions
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
    });
};

const ButtonGroup = ({ children }: ChildrenProps) => {
    const lastIdx = Children.count(children) - 1;
    return (
        <div css={emotion}>
            {React.Children.map(children, (button, idx) =>
                renderChild(button, idx, lastIdx)
            )}
        </div>
    );
};

export default ButtonGroup;
