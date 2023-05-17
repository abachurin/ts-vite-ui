import { useMemo } from "react";
import { css, SerializedStyles } from "@emotion/react";
import { useMode } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../utils";
import PaneAgent from "./PaneAgent/PaneAgent";
import PaneGame from "./PaneGame/PaneGame";

// Emotion styles

const makeEmotion = (textColor: string): SerializedStyles => css`
    display: flex;
    gap: ${GLOBAL.padding};
    flex-wrap: wrap;
    overflow: auto;
    color: ${textColor};
`;
const fixBoard = css`
    position: sticky;
    overflow: hidden;
    top: 0;
    z-index: 1;
`;

const Main = () => {
    const mode = useMode();
    const palette = usePalette();
    const textColor = palette.background;

    const emotion = useMemo(
        () =>
            css`
                ${makeEmotion(textColor)}
                ${mode.game === "play" ? fixBoard : ""}
            `,
        [textColor, mode.game]
    );

    return (
        <main css={emotion}>
            <PaneAgent />
            <PaneGame />
        </main>
    );
};

export default Main;
