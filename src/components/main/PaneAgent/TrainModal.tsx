import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
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
    defaultTrainingParams,
    undefinedTrainingParams,
    simulateCloseModalClick,
    validateTrainingParams,
    alphaSymbol,
    namingRule,
    inputToNumber,
} from "../../../utils";
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

/**
 * Train Agent modal.
 */
const TrainModal = () => {
    const palette = usePalette();
    const userName = useUserName();
    const anyJob = useAnyRunningJob();

    const setAgentMode = useModeStore((state) => state.setAgentMode);
    const setAgentName = useModeStore((state) => state.setAgentName);

    const [message, createMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [agents, setAgents] = useState<AgentDict>({});
    const getUserAgents = async () => {
        const { list, message } = await getItems("Agents", userName, "user");
        createMessage(message, "error");
        setAgents(list as AgentDict);
    };
    const agentList = Object.keys(agents);

    const [values, setValues] = useState<AgentTraining>(
        undefinedTrainingParams
    );
    const updateValues = useCallback((update: Partial<AgentTraining>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    useEffect(() => {
        getUserAgents();
        setValues(undefinedTrainingParams);
    }, [userName]);

    const setExistingValues = () => {
        if (!values.isNew && values.name) {
            updateValues({ ...agents[values.name] });
        }
    };
    useEffect(() => {
        setExistingValues();
    }, [values.isNew, values.name]);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const flipNewExisting = (value: string) => {
        if (value == "Existing") getUserAgents();
        updateValues({
            isNew: value == "New" ? true : false,
        });
    };

    const handleTrain = async () => {
        const [validated, change] = validateTrainingParams(values);
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
    };

    const alphaLabel =
        (values.isNew ? "Initial" : "Current") +
        " Learning Rate " +
        alphaSymbol;

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
                            onChange={(value) => updateValues({ name: value })}
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={agentList}
                            persistAs={`${userName}_train-existing`}
                            onChange={(value) => updateValues({ name: value })}
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
                            onChange={(value) =>
                                updateValues({
                                    N: inputToNumber(value),
                                })
                            }
                            zIndex={20}
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label={alphaLabel}
                            persistAs={`${userName}_train-alpha`}
                            min={values.isNew ? 0.1 : 0}
                            max={0.25}
                            step={0.01}
                            initialValue={values.alpha}
                            placeholder={"0.10 <= " + alphaSymbol + " <= 0.25"}
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({
                                    alpha: inputToNumber(value),
                                })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label={alphaSymbol + " decay rate"}
                            persistAs={`${userName}_train-decay`}
                            min={0.5}
                            max={1.0}
                            step={0.01}
                            initialValue={values.decay}
                            placeholder='1 = no decay'
                            disabled={!values.isNew}
                            onChange={(value) => {
                                updateValues({ decay: inputToNumber(value) });
                            }}
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Decay step, in episodes'
                            persistAs={`${userName}_train-step`}
                            min={1000}
                            max={10000}
                            step={1000}
                            initialValue={values.step}
                            placeholder='1000 <= x <= 10000'
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ step: inputToNumber(value) })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label={"Minimal " + alphaSymbol}
                            persistAs={`${userName}_train-minAlpha`}
                            min={0}
                            max={0.05}
                            step={0.001}
                            initialValue={values.minAlpha}
                            placeholder={"min " + alphaSymbol + " <= 0.05"}
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ minAlpha: inputToNumber(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Train episodes'
                            persistAs={`${userName}_train-episodes`}
                            min={values.isNew ? 0 : 5000}
                            max={100000}
                            step={5000}
                            initialValue={values.episodes}
                            placeholder={
                                values.isNew
                                    ? "Only create Agent"
                                    : "5k <= x <= 100k"
                            }
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
