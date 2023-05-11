import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "./contexts/UserProvider/UserContext";
import UserProvider from "./contexts/UserProvider/UserProvider";
import { GLOBAL } from "./utils";
import StarField from "./components/background/StarField";
import Header from "./components/Header/Header";
import PaneAgent from "./components/main/PaneAgent";
import PaneGame from "./components/main/PaneGame";
import Footer from "./components/Footer/Footer";

// Emotion styles
const makeEmotion = (textColor: string): SerializedStyles => css`
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    gap: ${GLOBAL.padding};
    margin: 0 auto;
    padding: calc(2 * ${GLOBAL.padding});
    max-width: ${GLOBAL.maxContainerWidth}px;
    & > main {
        display: flex;
        gap: ${GLOBAL.padding};
        flex-wrap: wrap;
        overflow: auto;
        color: ${textColor};
    }
`;

/**
 * Render the App component.
 */
function App() {
    const palette = usePalette();
    const textColor = palette.background;

    const emotion = useMemo(() => makeEmotion(textColor), [textColor]);

    return (
        <>
            <UserProvider>
                <StarField />
                <header css={emotion}>
                    <Header />
                    <main>
                        <PaneAgent />
                        <PaneGame />
                    </main>
                    <Footer />
                </header>
            </UserProvider>
        </>
    );
}

export default App;
