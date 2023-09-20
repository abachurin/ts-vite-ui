import { css } from "@emotion/react";
import { useUser, usePalette } from "../contexts/UserProvider/UserContext";
import { useLogs } from "../store/logsStore";
import { GLOBAL, setTransparency } from "../utils";
import { ButtonProps } from "../components/base/Button/Button";
import AdminLogs from "./AdminLogs";
import AdminManage from "./AdminManage";
import Pane from "../components/main/Pane";
import ButtonGroup from "../components/base/Button/ButtonGroup";
import Button from "../components/base/Button/Button";

// Emotion styles
const makeEmotion = (
    backgroundColor: string,
    textColor: string,
    logColor: string
) => css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: ${GLOBAL.padding};
    flex-wrap: wrap;
    overflow: auto;
    background-color: black;
    text-color: black;
    font-size: 0.85em;
    border-radius: ${GLOBAL.borderRadius};
    & > section {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: auto;
        padding: ${GLOBAL.padding};
        min-width: ${GLOBAL.minPaneWidth}px;
        background-color: ${backgroundColor};
    }
    & > section:nth-of-type(1) {
        color: ${logColor};
        position: relative;
    }
    & > section:nth-of-type(1) > aside {
        position: absolute;
        top: ${GLOBAL.padding};
        right: ${GLOBAL.padding};
    }
    & > section:nth-of-type(1) > main {
        margin-top: ${GLOBAL.padding};
        font-family: "Space Mono", monospace;
        text-align: left;
        color: ${logColor};
        padding: calc(${GLOBAL.padding} * 2);
        overflow: auto;
        display: flex;
        flex-direction: column-reverse;
        white-space: pre-wrap;
        margin-top: ${GLOBAL.padding};
        z-index: 0;
    }
    & > section:nth-of-type(2) {
        color: ${textColor};
    }
`;

const AdminPage = () => {
    const user = useUser();
    const palette = usePalette();

    if (user.level < 2) return null;

    const backgroundColor = setTransparency(palette.pane, palette.paneOpacity);
    const emotion = makeEmotion(
        backgroundColor,
        palette.background,
        palette.logs
    );

    return (
        <div css={emotion}>
            <AdminLogs />
            <AdminManage />
        </div>
    );
};

export default AdminPage;
