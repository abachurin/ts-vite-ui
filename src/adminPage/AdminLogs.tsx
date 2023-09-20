import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../contexts/UserProvider/UserContext";
import { useLogs } from "../store/logsStore";
import { GLOBAL } from "../utils";
import { ButtonProps } from "../components/base/Button/Button";
import Pane from "../components/main/Pane";
import ButtonGroup from "../components/base/Button/ButtonGroup";
import Button from "../components/base/Button/Button";

// Emotion styles
const makeEmotion = (logColor: string) => css`
    flex-wrap: wrap;
    overflow: auto;
    font-size: 0.85rem;
    position: relative;
    & > main {
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
`;

const AdminLogs = () => {
    const palette = usePalette();
    const { logs } = useLogs("admin");

    const emotion = useMemo(() => makeEmotion(palette.logs), [palette.logs]);

    const buttonParams: Partial<ButtonProps> = {
        type: "clickPress",
        color: palette.background,
    };

    return (
        <Pane>
            <div css={emotion}>
                <main css={emotion}>{logs.join("\n")}</main>
                <aside>
                    <ButtonGroup>
                        <Button {...buttonParams} background={palette.two}>
                            Download
                        </Button>
                        <Button {...buttonParams} background={palette.three}>
                            Clear
                        </Button>
                    </ButtonGroup>
                </aside>
            </div>
        </Pane>
    );
};

export default AdminLogs;
