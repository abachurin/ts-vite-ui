import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import ModeProvider from "../../contexts/ModeProvider/ModeProvider";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps, RGBA } from "../../types";
import { GLOBAL, setTransparency } from "../../utils";

// Emotion styles
const makeEmotion = (
    backgroundColor: RGBA,
    color: string
): SerializedStyles => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: ${GLOBAL.minPaneWidth}px;
    min-height: 30em;
    background-color: ${backgroundColor};
    color: ${color};
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
    const palette = usePalette();
    const backgroundColor = setTransparency(palette.pane, palette.paneOpacity);
    const color = palette.background;

    const emotion = useMemo(
        () => makeEmotion(backgroundColor, color),
        [backgroundColor, color]
    );

    return (
        <ModeProvider>
            <main id={id} css={emotion}>
                {children}
            </main>
        </ModeProvider>
    );
};

export default Pane;
