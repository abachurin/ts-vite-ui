import { css } from "@emotion/react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { connectAPI } from "../../../api/requests";
import useModeStore from "../../../store/modeStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUserName } from "../../../contexts/UserProvider/UserContext";
import useJobDescription from "../../../hooks/useJobDescription";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { RGB } from "../../../types";
import { GLOBAL, setTransparency } from "../../../utils/utils";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";
import DescriptionTable from "../../base/DescriptionTable";
import Cube from "../../base/Cube";

// Emotion styles
const makeEmotion = (
    backgroundColor: RGB,
    messageBackgroundColor: string
) => css`
    display: flex;
    width: 100%;
    border-radius: ${GLOBAL.borderRadius};
    background-color: ${setTransparency(backgroundColor, 0.2)};
    font-weight: 300;
    border: 1px solid ${messageBackgroundColor};
    & > main {
        flex: 1;
    }
    & > main > footer {
        margin-top: ${GLOBAL.padding};
        padding: ${GLOBAL.padding};
        width: 100%;
        background-color: ${messageBackgroundColor};
    }
    & > aside {
        flex: 0;
        margin-top: ${GLOBAL.padding};
        margin-right: calc(${GLOBAL.padding} * 2);
    }
`;

// Helper functions
type cancelJob = "STOP" | "KILL";
type cancelType = {
    description: string | undefined;
    type: cancelJob;
};

const JobDescriptionLabels = {
    name: "Agent name:",
    currentAlpha: "Current learning rate:",
    start: "Started at:",
    timeElapsed: "Elapsed time:",
    remainingTimeEstimate: "Remaining time estimate:",
    depth: "Look ahead (depth):",
    width: "Branching (width):",
    trigger: "Empty cells (trigger):",
    episodes: "Episodes:",
};

/**
 * Job description component.
 */
const CurrentJobDescription = () => {
    const palette = usePalette();
    const userName = useUserName();
    const job = useJobDescription(userName);

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const [waitCancel, setWaitCancel] = useState(false);
    const { message, createMessage } = useAlertMessage();

    // Clear message when "cancel job" operation completes
    useEffect(() => {
        createMessage();
        setWaitCancel(false);
    }, [job?.description, createMessage]);

    useEffect(() => {
        const type = job?.type;
        const jobType = type === 0 ? "train" : type === 1 ? "test" : "none";
        setAgentMode(jobType);
        setAgentName(job?.name);
    }, [job?.type, job?.name, setAgentMode, setAgentName]);

    const cancelJob = useCallback(
        async (type: cancelJob) => {
            const { result, error } = await connectAPI<cancelType, string>({
                method: "post",
                endpoint: "/jobs/cancel",
                data: { description: job?.description, type },
            });
            if (error) createMessage(error, "error");
            else {
                createMessage(result, "success", 100000);
                setWaitCancel(true);
            }
        },
        [job?.description, createMessage]
    );
    const stopJob = useCallback(() => cancelJob("STOP"), [cancelJob]);
    const killJob = useCallback(() => cancelJob("KILL"), [cancelJob]);

    const emotion = useMemo(
        () => makeEmotion(palette.two, palette.background),
        [palette]
    );

    if (!job) {
        return null;
    }

    return (
        <div css={emotion}>
            <main>
                <DescriptionTable
                    collection={job}
                    translation={JobDescriptionLabels}
                />
                {message && <footer>{message}</footer>}
            </main>
            <aside>
                <ButtonGroup>
                    <Button
                        type='clickPress'
                        background={palette.three}
                        onClick={stopJob}
                    >
                        STOP
                    </Button>
                    <Button
                        type='clickPress'
                        background={palette.error}
                        onClick={killJob}
                    >
                        KILL
                    </Button>
                </ButtonGroup>
            </aside>
            {waitCancel && <Cube />}
        </div>
    );
};

export default CurrentJobDescription;
