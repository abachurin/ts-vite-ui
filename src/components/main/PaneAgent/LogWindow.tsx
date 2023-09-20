import { css } from "@emotion/react";
import { useMemo, useEffect } from "react";
import useAlert from "../../../hooks/useAlert";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useLogsStore, { useLogs } from "../../../store/logsStore";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";
import { UserName } from "../../../types";
import { GLOBAL } from "../../../utils";

// Emotion styles
const makeEmotion = (color: string) => css`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    overflow: auto;
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

/**
 * Log window.
 */
const LogWindow = ({ userName }: UserName) => {
    const palette = usePalette();

    const clearLogs = useLogsStore((state) => state.clearLogs);
    const downloadLogs = useLogsStore((state) => state.downloadLogs);

    const { logs, alertBackend } = useLogs(userName);

    const [warning, openWarning, closeWarning] = useAlert({
        type: "error",
        duration: 10000000,
        children: "Network error. Backend does not respond!",
    });

    useEffect(() => {
        if (alertBackend) openWarning();
        else closeWarning();
    }, [alertBackend]);

    const emotion = useMemo(() => makeEmotion(palette.logs), [palette.logs]);

    return (
        <div css={emotion}>
            <main>{logs.join("\n")}</main>
            <aside>
                {logs.length ? (
                    <ButtonGroup>
                        <Button
                            type='clickPress'
                            color={palette.background}
                            background={palette.three}
                            onClick={downloadLogs}
                        >
                            DOWNLOAD
                        </Button>
                        <Button
                            type='clickPress'
                            color={palette.background}
                            background={palette.error}
                            onClick={() => clearLogs(userName)}
                        >
                            CLEAR
                        </Button>
                    </ButtonGroup>
                ) : null}
            </aside>
            {warning}
        </div>
    );
};

export default LogWindow;
