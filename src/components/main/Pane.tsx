import { css } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
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

/**
 * A React component that renders a flexible pane.
 * @param props - The props object with optional properties and children.
 */
interface PaneProps extends ChildrenProps {
    id?: string;
}
const Pane = ({ id, children }: PaneProps) => {
    return (
        <div id={id} css={emotion}>
            {children}
        </div>
    );
};

export default Pane;
