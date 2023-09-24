import { useMemo } from "react";
import { css } from "@emotion/react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../utils/utils";
import PaneAgent from "./PaneAgent/PaneAgent";
import PaneGame from "./PaneGame/PaneGame";
import Footer from "../Footer/Footer";

// Emotion styles

const makeEmotion = (textColor: string) => css`
    display: flex;
    gap: ${GLOBAL.padding};
    flex-wrap: wrap;
    overflow: auto;
    color: ${textColor};
`;

const Main = () => {
    const palette = usePalette();

    const emotion = useMemo(
        () => makeEmotion(palette.background),
        [palette.background]
    );

    return (
        <>
            <main css={emotion}>
                <PaneAgent />
                <PaneGame />
            </main>
            <Footer />
        </>
    );
};

export default Main;
