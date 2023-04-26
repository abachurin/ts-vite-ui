import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";
import { ChildrenProps } from "../../types";

interface PaneProps extends ChildrenProps {
    id?: string;
}

/**
 * A React component that renders a flexible pane.
 *
 * @param props - The props object with optional properties and children.
 */
const Pane = (props: PaneProps) => {
    const emotion = css`
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: ${GLOBAL.minPaneWidth}px;
        min-height: 30em;
        background-color: ${GLOBAL.backgrounds.blue};
        padding: ${GLOBAL.padding};
        border-radius: ${GLOBAL.borderRadius};
    `;

    return <div {...props} css={emotion}></div>;
};

export default Pane;
