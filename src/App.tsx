import { css } from "@emotion/react";
import UserProvider from "./contexts/UserProvider/UserProvider";
import { GLOBAL } from "./utils";
import StarField from "./components/background/StarField";
import Header from "./components/Header/Header";
import Main from "./components/main/Main";
import Footer from "./components/Footer/Footer";

import StarFieldCanvas from "./components/background/starFieldCanvas";

// Emotion styles
const emotion = css`
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
`;

function App() {
    return (
        <>
            <UserProvider>
                <StarField />
                <main css={emotion}>
                    <Header />
                    <Main />
                    <Footer />
                </main>
            </UserProvider>
        </>
    );
}

export default App;
