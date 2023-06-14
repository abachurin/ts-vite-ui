import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useLogs, { useLogsStore } from "../../../store/logsStore";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";
import { GLOBAL } from "../../../utils";

// Emotion styles
const makeEmotion = (color: string): SerializedStyles => css`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    display: flex;
    & > main {
        margin-top: ${GLOBAL.padding};
        font-family: "Space Mono", monospace;
        text-align: left;
        color: ${color};
        padding: calc(${GLOBAL.padding} * 2);
        overflow: auto;
        display: flex;
        flex-direction: column-reverse;
        white-space: pre-wrap;
        margin-top: ${GLOBAL.padding};
        z-index: 0;
    }
    & > aside {
        position: absolute;
        top: ${GLOBAL.padding};
        right: calc(${GLOBAL.padding} * 2);
    }
`;

const LogWindow = () => {
    const user = useUser();
    const logs = useLogs(user.name);
    const palette = usePalette();
    const clearLogs = useLogsStore((state) => state.clearLogs);
    const downloadLogs = useLogsStore((state) => state.downloadLogs);

    const emotion = useMemo(() => makeEmotion(palette.logs), [palette]);

    return (
        <div css={emotion}>
            <main>{logs.join("\n")}</main>
            <aside>
                <ButtonGroup>
                    <Button
                        type='clickPress'
                        color={palette.background}
                        background={palette.error}
                        disabled={logs.length === 0}
                        onClick={() => clearLogs(user.name)}
                    >
                        CLEAR
                    </Button>
                    <Button
                        type='clickPress'
                        color={palette.background}
                        background={palette.three}
                        disabled={logs.length === 0}
                        onClick={() => downloadLogs()}
                    >
                        DOWNLOAD
                    </Button>
                </ButtonGroup>
            </aside>
        </div>
    );
};

export default LogWindow;
