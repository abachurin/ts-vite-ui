import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;
    padding-inline: calc(${GLOBAL.padding} * 2);
    padding-block: ${GLOBAL.padding};
    font-size: 0.85rem;
    & > * {
        margin: auto;
    }
`;

/**
 * A React component that renders a flexible pane.
 * @param children
 */
const PaneBody = ({ children }: ChildrenProps) => {
    return <main css={emotion}>{children}</main>;
};

export default PaneBody;
