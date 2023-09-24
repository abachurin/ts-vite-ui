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
import { AgentTesting, ButtonVariants } from "../../../types";
import {
    GLOBAL,
    simulateCloseModalClick,
    specialAgents,
    startUpperCase,
} from "../../../utils/utils";
import {
    testParamConstraints,
    defaultTestingParams,
    undefinedTestingParams,
    validateTestParams,
    inputToNumber,
} from "../../../utils/validation";
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

// Helper functions
type NumInput = keyof typeof testParamConstraints;

/**
 * Test Agent modal.
 */
const TestModal = () => {
    const palette = usePalette();
    const userName = useUserName();
    const anyJob = useAnyRunningJob();

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const { message, createMessage } = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<AgentTesting>(undefinedTestingParams);
    const updateValues = useCallback((update: Partial<AgentTesting>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const [agents, setAgents] = useState<string[]>([]);
    const getAllAgentNames = useCallback(async () => {
        const { list, message } = await getJustNames("Agents", userName, "all");
        createMessage(message, "error");
        setAgents(list);
    }, [userName, createMessage]);

    // Refresh Test parameters for a new User to persisted (or undefined if none)
    useEffect(() => {
        setValues(undefinedTestingParams);
        getAllAgentNames();
    }, [userName, getAllAgentNames]);

    // Main "GO" function
    const handleTest = useCallback(async () => {
        const [validated, change] = validateTestParams(values);
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
    }, [values, userName, createMessage, setAgentName, setAgentMode]);

    const handleResetDefaults = () => {
        const resetValues = { ...defaultTestingParams };
        resetValues.name = values.name;
        setValues(resetValues);
    };

    // Need to wrap onChange functions for Inputs in Callbacks to avoid infinite re-render loops
    const handleChangeName = useCallback(
        (value: string) => updateValues({ name: value }),
        [updateValues]
    );
    const handleChangeNumValue = useCallback(
        (key: NumInput, value: string) =>
            updateValues({ [key]: inputToNumber(value) }),
        [updateValues]
    );
    const handleChangeDepth = useCallback(
        (value: string) => handleChangeNumValue("depth", value),
        [handleChangeNumValue]
    );
    const handleChangeWidth = useCallback(
        (value: string) => handleChangeNumValue("width", value),
        [handleChangeNumValue]
    );
    const handleChangeTrigger = useCallback(
        (value: string) => handleChangeNumValue("trigger", value),
        [handleChangeNumValue]
    );
    const handleChangeEpisodes = useCallback(
        (value: string) => handleChangeNumValue("episodes", value),
        [handleChangeNumValue]
    );
    const handleChangeNumParams = {
        depth: handleChangeDepth,
        width: handleChangeWidth,
        trigger: handleChangeTrigger,
        episodes: handleChangeEpisodes,
    };
    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const renderInput = (key: NumInput) => {
        const min = testParamConstraints[key].min;
        const max = testParamConstraints[key].max;
        return (
            <Input
                {...inputParameters}
                type='number'
                label={startUpperCase(key)}
                initialValue={values[key]}
                persistAs={`${userName}_test-${key}`}
                min={min}
                max={max}
                step={testParamConstraints[key].step}
                placeholder={`${min} <= * <= ${max}`}
                onChange={handleChangeNumParams[key]}
            />
        );
    };

    const buttonParams = {
        type: "clickPress" as ButtonVariants,
        width: "8rem",
        color: palette.background,
        disabled: loading,
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
                        onChange={handleChangeName}
                        zIndex={30}
                    />
                    <section>
                        {renderInput("depth")}
                        {renderInput("width")}
                    </section>
                    <section>
                        {renderInput("trigger")}
                        {renderInput("episodes")}
                    </section>
                </main>
            </ModalBody>
            <ModalFooter>
                <div css={footerWrapper}>
                    <Button
                        {...buttonParams}
                        background={palette.three}
                        onClick={handleTest}
                    >
                        GO!
                    </Button>
                    <Button
                        {...buttonParams}
                        background={palette.two}
                        onClick={handleResetDefaults}
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
