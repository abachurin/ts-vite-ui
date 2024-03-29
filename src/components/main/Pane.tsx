import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL, setTransparency } from "../../utils/utils";

// Emotion styles
const makeEmotion = (backgroundColor: string, color: string) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    min-width: ${GLOBAL.minPaneWidth}px;
    background-color: ${backgroundColor};
    color: ${color};
    border-radius: ${GLOBAL.borderRadius};
`;

/**
 * A React component that renders a flexible pane.
 * @param id - HTML id of the pane, optional
 */
interface PaneProps extends ChildrenProps {
    id?: string;
}
const Pane = ({ id, children }: PaneProps) => {
    const palette = usePalette();
    const backgroundColor = setTransparency(palette.pane, palette.paneOpacity);
    const color = palette.background;

    const emotion = useMemo(
        () => makeEmotion(backgroundColor, color),
        [backgroundColor, color]
    );

    return (
        <div id={id} css={emotion}>
            {children}
        </div>
    );
};

export default Pane;
