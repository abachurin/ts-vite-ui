import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { connectAPI, getJustNames } from "../../../api/utils";
import useModeStore from "../../../store/modeStore";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import useAnyRunningJob from "../../../hooks/useAnyJob";
import { AgentTesting } from "../../../types";
import {
    GLOBAL,
    defaultTestingParams,
    simulateCloseModalClick,
    validateTestingParams,
    specialAgents,
} from "../../../utils";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Input from "../../base/Input";
import Modal from "../../modal/Modal";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import ModalHeader from "../../modal/ModalHeader";

// Emotion styles
const footerWrapper = css`
    flex: 1;
    display: flex;
    justify-content: space-between;
`;
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding-block: calc(${GLOBAL.padding} * 2);
    padding-inline: ${GLOBAL.padding};
    & > * {
        flex: 1;
    }
    & > section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${GLOBAL.padding};
    }
    & > section > * {
        flex: 1;
    }
`;

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TestModal = () => {
    const palette = usePalette();
    const user = useUser();
    const anyJob = useAnyRunningJob();

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const [message, createMessage] = useAlertMessage("");
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<AgentTesting>(defaultTestingParams);
    const updateValues = useCallback((update: Partial<AgentTesting>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const [agents, setAgents] = useState<string[]>([]);
    const getAllAgentNames = async () => {
        const { list, message } = await getJustNames(
            "Agents",
            user.name,
            "all"
        );
        createMessage(message, "error");
        setAgents(list);
    };
    useEffect(() => {
        getAllAgentNames();
    }, [user]);

    useEffect(() => {
        values.name && updateValues({ name: values.name });
    }, [values.name]);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const handleTest = async () => {
        const [validated, change] = validateTestingParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));
        if (change) {
            createMessage(
                "Some parameters are invalid or undefined. Please follow the instructions.",
                "error"
            );
        } else {
            setLoading(true);
            createMessage("Processing Job ...");
            const { result, error } = await connectAPI<AgentTesting, string>({
                method: "post",
                endpoint: "/jobs/test",
                data: { ...values, user: user.name },
            });
            if (error) {
                createMessage(error, "error");
            } else {
                if (result !== "ok") {
                    createMessage(result, "error");
                } else {
                    createMessage("Testing commenced, follow logs", "success");
                    setAgentName(values.name);
                    setAgentMode("test");
                    setTimeout(() => {
                        simulateCloseModalClick();
                    }, 1500);
                }
            }
            setLoading(false);
        }
    };

    const handleResetDefaults = () => {
        const resetValues = { ...defaultTestingParams };
        resetValues.name = values.name;
        setValues(resetValues);
    };

    const allAgents = [...specialAgents, ...agents];

    return (
        <Modal
            button={{
                background: palette.two,
                children: "Test",
                legend: "Only for registered users, and when no Job is running",
                level: GLOBAL.userLevel.user,
                disabled: anyJob,
            }}
            modal={{
                width: "26rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h2>Testing Parameters</h2>
            </ModalHeader>
            <ModalBody overflow='visible'>
                <main css={emotion}>
                    <Dropdown
                        {...inputParameters}
                        label='Existing Agent Name'
                        optionValues={allAgents}
                        persistAs='train-existing-name'
                        initialValue={values.name}
                        onChange={(value) =>
                            updateValues({ name: String(value) })
                        }
                        zIndex={30}
                    />

                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Depth'
                            initialValue={values.depth}
                            persistAs='test-depth'
                            min={0}
                            max={2}
                            step={1}
                            placeholder='0 <= depth <= 2'
                            onChange={(value) =>
                                updateValues({
                                    depth:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Width'
                            initialValue={values.width}
                            persistAs='test-width'
                            min={0}
                            max={3}
                            step={1}
                            placeholder='0 <= width <= 3'
                            onChange={(value) =>
                                updateValues({
                                    width:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Trigger'
                            initialValue={values.trigger}
                            persistAs='test-trigger'
                            min={0}
                            max={6}
                            step={1}
                            placeholder='0 <= trigger <= 6'
                            onChange={(value) =>
                                updateValues({
                                    trigger:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Test episodes'
                            initialValue={values.episodes || undefined}
                            persistAs='train-episodes'
                            min={100}
                            max={10000}
                            step={100}
                            placeholder='100 <= trigger <= 10000'
                            onChange={(value) =>
                                updateValues({ episodes: Number(value) })
                            }
                        />
                    </section>
                </main>
            </ModalBody>
            <ModalFooter>
                <div css={footerWrapper}>
                    <Button
                        type='clickPress'
                        width='8rem'
                        background={palette.three}
                        color={palette.background}
                        onClick={handleTest}
                        disabled={loading}
                    >
                        GO!
                    </Button>
                    <Button
                        type='clickPress'
                        width='8rem'
                        background={palette.two}
                        color={palette.background}
                        onClick={handleResetDefaults}
                        disabled={loading}
                    >
                        Reset Defaults
                    </Button>
                </div>
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
        </Modal>
    );
};

export default TestModal;
