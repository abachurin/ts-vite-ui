import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { connectAPI, getJustNames } from "../../../api/requests";
import useModeStore from "../../../store/modeStore";
import {
    usePalette,
    useUserName,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import useAnyRunningJob from "../../../hooks/useAnyRunningJob";
import { AgentTesting } from "../../../types";
import {
    GLOBAL,
    defaultTestingParams,
    undefinedTestingParams,
    simulateCloseModalClick,
    validateTestingParams,
    specialAgents,
    inputToNumber,
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
 * Test Agent modal.
 */
const TestModal = () => {
    const palette = usePalette();
    const userName = useUserName();
    const anyJob = useAnyRunningJob();

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const [message, createMessage] = useAlertMessage("");
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<AgentTesting>(undefinedTestingParams);
    const updateValues = useCallback((update: Partial<AgentTesting>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const [agents, setAgents] = useState<string[]>([]);
    const getAllAgentNames = async () => {
        const { list, message } = await getJustNames("Agents", userName, "all");
        createMessage(message, "error");
        setAgents(list);
    };

    useEffect(() => {
        setValues(undefinedTestingParams);
        getAllAgentNames();
    }, [userName]);

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
                data: { ...values, user: userName },
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
                legend: "Register to unlock Train/Test mode",
                level: GLOBAL.userLevel.user,
                disabled: anyJob,
                onClick: getAllAgentNames,
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
                        persistAs={`${userName}_test-name`}
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
                            persistAs={`${userName}_test-depth`}
                            min={0}
                            max={2}
                            step={1}
                            placeholder='0 <= x <= 2'
                            onChange={(value) =>
                                updateValues({ depth: inputToNumber(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Width'
                            initialValue={values.width}
                            persistAs={`${userName}_test-width`}
                            min={1}
                            max={3}
                            step={1}
                            placeholder='1 <= x <= 3'
                            onChange={(value) =>
                                updateValues({ width: inputToNumber(value) })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Trigger'
                            initialValue={values.trigger}
                            persistAs={`${userName}_test-trigger`}
                            min={0}
                            max={6}
                            step={1}
                            placeholder='0 <= x <= 6'
                            onChange={(value) =>
                                updateValues({ trigger: inputToNumber(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Test episodes'
                            initialValue={values.episodes}
                            persistAs={`${userName}_test-episodes`}
                            min={100}
                            max={1000}
                            step={100}
                            placeholder='100 <= x <= 1000'
                            onChange={(value) =>
                                updateValues({ episodes: inputToNumber(value) })
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
