import { css } from "@emotion/react";
import { useCallback, useMemo, useEffect, useState } from "react";
import { connectAPI, getItems } from "../../../api/requests";
import useModeStore from "../../../store/modeStore";
import {
    usePalette,
    useUserName,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import useAnyRunningJob from "../../../hooks/useAnyRunningJob";
import { AgentDict, AgentTraining } from "../../../types";
import {
    GLOBAL,
    simulateCloseModalClick,
    alphaSymbol,
    namingRule,
} from "../../../utils/utils";
import {
    trainParamConstraints,
    defaultTrainingParams,
    undefinedTrainingParams,
    validateTrainParams,
    inputToNumber,
} from "../../../utils/validation";
import Button from "../../base/Button/Button";
import Dropdown from "../../base/Dropdown";
import Input from "../../base/Input";
import Radio from "../../base/Radio";
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
type NumInput = keyof typeof trainParamConstraints;

/**
 * Train Agent modal.
 */
const TrainModal = () => {
    const palette = usePalette();
    const userName = useUserName();
    const anyJob = useAnyRunningJob();

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const { message, createMessage } = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [agents, setAgents] = useState<AgentDict>({});
    const agentList = Object.keys(agents);
    const getUserAgents = useCallback(async () => {
        const { list, message } = await getItems("Agents", userName, "user");
        createMessage(message, "error");
        setAgents(list as AgentDict);
    }, [userName, createMessage]);

    const [values, setValues] = useState<AgentTraining>(
        undefinedTrainingParams
    );
    const updateValues = useCallback((update: Partial<AgentTraining>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    // Get existing Agents list on User change
    useEffect(() => {
        getUserAgents();
        setValues(undefinedTrainingParams);
    }, [userName, getUserAgents]);

    // Show existing values when continue training existing Agent
    const setExistingValues = useCallback(() => {
        if (!values.isNew && values.name) {
            updateValues({ ...agents[values.name] });
        }
    }, [values.isNew, values.name, agents, updateValues]);
    useEffect(() => {
        setExistingValues();
    }, [setExistingValues]);

    // Main "GO" function
    const handleTrain = useCallback(async () => {
        const [validated, change] = validateTrainParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));

        if (change) {
            createMessage("Some parameters are invalid or undefined", "error");
        } else {
            setLoading(true);
            createMessage("Processing Job ...");
            const { result, error } = await connectAPI<AgentTraining, string>({
                method: "post",
                endpoint: "/jobs/train",
                data: { ...values, user: userName },
            });
            if (error) {
                createMessage(error, "error");
            } else {
                if (result !== "ok") {
                    createMessage(result, "error");
                } else {
                    const message = values.isNew
                        ? `New Agent created${
                              (values.episodes as number) > 0
                                  ? ", training commenced, follow the logs"
                                  : ""
                          }`
                        : "Training resumed, follow the logs";
                    createMessage(message, "success");
                    setAgentName(values.name);
                    setAgentMode("train");
                    setTimeout(() => {
                        simulateCloseModalClick();
                    }, 1500);
                }
            }
            setLoading(false);
        }
    }, [createMessage, setAgentMode, setAgentName, userName, values]);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    // Need to wrap onChange functions for Inputs in Callbacks to avoid infinite re-render loops
    const flipNewExisting = useCallback(
        (value: string) => {
            if (value == "Existing") getUserAgents();
            updateValues({
                isNew: value == "New" ? true : false,
            });
        },
        [getUserAgents, updateValues]
    );
    const handleChangeName = useCallback(
        (value: string) => updateValues({ name: value }),
        [updateValues]
    );
    const handleChangeN = useCallback(
        (value: string) =>
            updateValues({
                N: inputToNumber(value),
            }),
        [updateValues]
    );
    const handleChangeNumValue = useCallback(
        (key: NumInput, value: string) =>
            updateValues({ [key]: inputToNumber(value) }),
        [updateValues]
    );
    const handleChangeAlpha = useCallback(
        (value: string) => handleChangeNumValue("alpha", value),
        [handleChangeNumValue]
    );
    const handleChangeDecay = useCallback(
        (value: string) => handleChangeNumValue("decay", value),
        [handleChangeNumValue]
    );
    const handleChangeStep = useCallback(
        (value: string) => handleChangeNumValue("step", value),
        [handleChangeNumValue]
    );
    const handleChangeMinAlpha = useCallback(
        (value: string) => handleChangeNumValue("minAlpha", value),
        [handleChangeNumValue]
    );
    const handleChangeEpisodes = useCallback(
        (value: string) => handleChangeNumValue("episodes", value),
        [handleChangeNumValue]
    );
    const handleChangeNumParams = {
        alpha: handleChangeAlpha,
        decay: handleChangeDecay,
        step: handleChangeStep,
        minAlpha: handleChangeMinAlpha,
        episodes: handleChangeEpisodes,
    };
    const labelsNumParams = useMemo(() => {
        return {
            alpha:
                (values.isNew ? "Initial" : "Current") +
                " Learning Rate " +
                alphaSymbol,
            decay: alphaSymbol + " decay rate",
            step: "Decay step, in episodes",
            minAlpha: "Minimal " + alphaSymbol,
            episodes: "Episodes",
        };
    }, [values.isNew]);

    const renderInput = (key: NumInput) => {
        const min = trainParamConstraints[key].min;
        const max = trainParamConstraints[key].max;
        return (
            <Input
                {...inputParameters}
                type='number'
                label={labelsNumParams[key]}
                initialValue={values[key]}
                persistAs={`${userName}_train-${key}`}
                min={min}
                max={max}
                step={trainParamConstraints[key].step}
                placeholder={`${min} <= * <= ${max}`}
                disabled={!values.isNew && key !== "episodes"}
                onChange={handleChangeNumParams[key]}
            />
        );
    };

    // Prop until i make possible to choose workers run independently by any User
    // Option N = 6 will crash the server at the moment due to massive Memory usage
    const optionsForN =
        userName === "Loki" ? ["2", "3", "4", "5", "6"] : ["2", "3", "4", "5"];

    return (
        <Modal
            button={{
                background: palette.two,
                children: "Train",
                legend: "Register to unlock Train/Test mode",
                level: GLOBAL.userLevel.user,
                disabled: anyJob,
                onClick: () => setTimeout(() => setExistingValues(), 100),
            }}
            modal={{
                width: "26rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h2>Training Parameters</h2>
            </ModalHeader>
            <ModalBody overflow='visible'>
                <main css={emotion}>
                    <Radio
                        backgroundColor={palette.background}
                        controlColor={palette.three}
                        color1={palette.two}
                        color2={palette.one}
                        label={"Train new / keep training existing Agent"}
                        options={["New", "Existing"]}
                        initialValue={values.isNew ? "New" : "Existing"}
                        onChange={flipNewExisting}
                    />
                    {values.isNew ? (
                        <Input
                            {...inputParameters}
                            type='text'
                            label='New Agent Name'
                            persistAs={`${userName}_train-new`}
                            initialValue={values.name}
                            placeholder={namingRule}
                            onChange={handleChangeName}
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={agentList}
                            persistAs={`${userName}_train-existing`}
                            onChange={handleChangeName}
                            zIndex={30}
                        />
                    )}
                    <section>
                        <Dropdown
                            {...inputParameters}
                            label='Signature N'
                            optionValues={optionsForN}
                            persistAs={`${userName}_train-N`}
                            disabled={!values.isNew}
                            initialValue={values.N}
                            alignOptions='right'
                            onChange={handleChangeN}
                            zIndex={20}
                        />
                        {renderInput("alpha")}
                    </section>
                    <section>
                        {renderInput("decay")}
                        {renderInput("step")}
                    </section>
                    <section>
                        {renderInput("minAlpha")}
                        {renderInput("episodes")}
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
                        onClick={handleTrain}
                        disabled={loading}
                    >
                        GO!
                    </Button>
                    {values.isNew ? (
                        <Button
                            type='clickPress'
                            width='8rem'
                            background={palette.two}
                            color={palette.background}
                            onClick={() => setValues(defaultTrainingParams)}
                        >
                            Reset Defaults
                        </Button>
                    ) : null}
                </div>
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
        </Modal>
    );
};

export default TrainModal;
