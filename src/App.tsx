import { css } from "@emotion/react";
import UserProvider from "./contexts/UserContext";
import StarField from "./components/background/StarField";
import Header from "./components/Header/Header";
import PaneAgent from "./components/main/PaneAgent";
import PaneGame from "./components/main/PaneGame";
import Footer from "./components/Footer/Footer";
import { GLOBAL } from "./utils";

function App() {
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
        max-width: 1400px;
    `;

    const main = css`
        display: flex;
        gap: ${GLOBAL.padding};
        flex-wrap: wrap;
        overflow: auto;
        color: white;
    `;

    return (
        <>
            <UserProvider>
                <StarField />
                <div css={container}>
                    <Header
                        logoColor={GLOBAL.colors.neon}
                        backgroundColor={GLOBAL.backgrounds.pink}
                        textColor='inherit'
                    ></Header>
                    <div css={main}>
                        <PaneAgent />
                        <PaneGame />
                    </div>
                    <Footer></Footer>
                </div>
            </UserProvider>
        </>
    );
}

export default App;
