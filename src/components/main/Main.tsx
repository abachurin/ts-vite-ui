import { useMemo } from "react";
import { css, SerializedStyles } from "@emotion/react";
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

const Main = () => {
    const palette = usePalette();
    const textColor = palette.background;

    const emotion = useMemo(() => makeEmotion(textColor), [textColor]);

    return (
        <main css={emotion}>
            <PaneAgent />
            <PaneGame />
        </main>
    );
};

export default Main;
