import { css } from "@emotion/react";
import UserProvider from "./contexts/UserProvider/UserProvider";
import { GLOBAL } from "./utils";
import StarField from "./components/background/StarField";
import Header from "./components/Header/Header";
import PaneAgent from "./components/main/PaneAgent";
import PaneGame from "./components/main/PaneGame";
import Footer from "./components/Footer/Footer";

// Emotion styles
const container = css`
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    color: ${GLOBAL.colors.white};
    gap: ${GLOBAL.padding};
    margin: 0 auto;
    padding: calc(2 * ${GLOBAL.padding});
    max-width: ${GLOBAL.maxContainerWidth}px;
`;
const main = css`
    display: flex;
    gap: ${GLOBAL.padding};
    flex-wrap: wrap;
    overflow: auto;
    color: white;
`;

/**
 * Render the App component (what else?).
 */
function App() {
    return (
        <>
            <UserProvider>
                <StarField />
                <div css={container}>
                    <Header
                        logoColor={GLOBAL.colors.neon}
                        backgroundColor={GLOBAL.backgrounds.pink}
                        textColor='inherit'
                    />
                    <div css={main}>
                        <PaneAgent />
                        <PaneGame />
                    </div>
                    <Footer />
                </div>
            </UserProvider>
        </>
    );
}

export default App;
