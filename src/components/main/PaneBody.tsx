import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-block: ${GLOBAL.padding};
    font-size: 0.85rem;
    overflow: auto;
    & > * {
        margin-inline: auto;
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
