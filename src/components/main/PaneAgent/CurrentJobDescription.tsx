import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { connectAPI } from "../../../api/utils";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useJobDescription from "../../../hooks/useJobDescription";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { RGB } from "../../../types";
import { GLOBAL, setTransparency, JobDescriptionLabels } from "../../../utils";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";
import DescriptionTable from "../../base/DescriptionTable";

// Emotion styles
const makeEmotion = (
    backgroundColor: RGB,
    messageBackgroundColor: string
): SerializedStyles => css`
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
    description: string;
    type: cancelJob;
};

const CurrentJobDescription = () => {
    const palette = usePalette();
    const user = useUser();
    const job = useJobDescription(user.name);
    const updateMode = useModeUpdate();
    const [message, createMessage] = useAlertMessage("");

    useEffect(() => {
        const type = job?.type;
        const jobType = type === 0 ? "train" : type === 1 ? "test" : "none";
        updateMode({ agent: jobType });
    });

    const cancelJobMutation = useMutation(
        (values: cancelType) =>
            connectAPI<cancelType, string>({
                method: "post",
                endpoint: "/jobs/cancel",
                data: values,
            }),
        {
            onSuccess: ({ result, error }) => {
                if (error) {
                    createMessage(error, "error");
                } else {
                    createMessage(result, "success");
                }
            },
        }
    );

    const emotion = useMemo(
        () => makeEmotion(palette.two, palette.background),
        [palette]
    );

    return (
        <>
            {job && (
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
                                onClick={() =>
                                    cancelJobMutation.mutate({
                                        description: job.description,
                                        type: "STOP",
                                    })
                                }
                            >
                                STOP
                            </Button>
                            <Button
                                type='clickPress'
                                background={palette.error}
                                onClick={() =>
                                    cancelJobMutation.mutate({
                                        description: job.description,
                                        type: "KILL",
                                    })
                                }
                            >
                                KILL
                            </Button>
                        </ButtonGroup>
                    </aside>
                </div>
            )}
        </>
    );
};

export default CurrentJobDescription;
