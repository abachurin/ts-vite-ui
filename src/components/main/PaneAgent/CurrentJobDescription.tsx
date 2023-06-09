import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { connectAPI } from "../../../api/utils";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useJobDescription from "../../../hooks/useJobDescription";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { uniqueId } from "lodash-es";
import { RGB } from "../../../types";
import { GLOBAL, setTransparency, JobDescriptionLabels } from "../../../utils";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";

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
        display: flex;
        flex-direction: column;
        line-height: 1.4rem;
        padding: calc(${GLOBAL.padding} * 2);
    }
    & > main > section {
        display: flex;
    }
    & > main > footer {
        margin-top: ${GLOBAL.padding};
        padding: ${GLOBAL.padding};
        width: 100%;
        background-color: ${messageBackgroundColor};
    }
    & > main > section > * {
        flex: 1;
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
    const [message, createMessage] = useAlertMessage("");

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
                        {Object.entries(job).map(([label, value]) => {
                            const labelName =
                                JobDescriptionLabels[
                                    label as keyof typeof JobDescriptionLabels
                                ];
                            return (
                                labelName && (
                                    <section key={uniqueId()}>
                                        <label>{labelName}</label>
                                        <div>{value}</div>
                                    </section>
                                )
                            );
                        })}
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
