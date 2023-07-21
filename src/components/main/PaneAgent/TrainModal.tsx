import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { connectAPI, getItems } from "../../../api/utils";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import useAnyRunningJob from "../../../hooks/useAnyJob";
import { AgentDict, AgentTraining } from "../../../types";
import {
    GLOBAL,
    defaultTrainingParams,
    simulateCloseModalClick,
    validateTrainingParams,
    alphaSymbol,
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
    justify-content: center;
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
const TrainModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();
    const user = useUser();
    const anyJob = useAnyRunningJob();

    const [message, createMessage] = useAlertMessage("");
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<AgentTraining>(defaultTrainingParams);
    const updateValues = useCallback((update: Partial<AgentTraining>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const [agents, setAgents] = useState<AgentDict>({});
    const getUserAgents = async () => {
        const { list, message } = await getItems("Agents", user.name, "user");
        createMessage(message, "error");
        setAgents(list as AgentDict);
    };
    useEffect(() => {
        getUserAgents();
    }, [user]);
    const agentList = Object.keys(agents);

    useEffect(() => {
        if (!values.isNew && values.name) {
            updateValues({ ...agents[values.name] });
        }
    }, [values.isNew, values.name]);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const handleTrain = async () => {
        const [validated, change] = validateTrainingParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));

        if (change) {
            createMessage(
                "Some parameters are invalid or undefined. Please follow the instructions.",
                "error"
            );
        } else {
            setLoading(true);
            createMessage("Processing Job ...");
            const { result, error } = await connectAPI<AgentTraining, string>({
                method: "post",
                endpoint: "/jobs/train",
                data: { ...values, user: user.name },
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
                    modeUpdate({ agent: "train" });
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

    return (
        <Modal
            button={{
                background: palette.two,
                children: "Train",
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
                        onChange={(value: string) => {
                            if (value == "Existing") {
                                getUserAgents();
                            }
                            updateValues({
                                isNew: value == "New" ? true : false,
                            });
                        }}
                    />
                    {values.isNew ? (
                        <Input
                            {...inputParameters}
                            type='text'
                            label='New Agent Name'
                            persistAs='train-new-name'
                            initialValue={values.name}
                            placeholder={`Letters, numerals, dash, underscore, 1-${GLOBAL.maxNameLength} chars`}
                            onChange={(value) =>
                                updateValues({ name: String(value) })
                            }
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={agentList}
                            persistAs='train-existing-name'
                            initialValue={values.name}
                            onChange={(value) =>
                                updateValues({ name: String(value) })
                            }
                            zIndex={30}
                        />
                    )}
                    <section>
                        <Dropdown
                            {...inputParameters}
                            label='Signature N'
                            optionValues={["2", "3", "4"]}
                            initialValue={values.N}
                            persistAs='train-N'
                            disabled={!values.isNew}
                            alignOptions='right'
                            onChange={(value) =>
                                updateValues({
                                    N: Number(value),
                                })
                            }
                            zIndex={20}
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label={alphaLabel}
                            initialValue={values.alpha || undefined}
                            persistAs='train-alpha'
                            min={values.isNew ? 0.1 : 0}
                            max={0.25}
                            step={0.01}
                            placeholder={"0.10 <= " + alphaSymbol + " <= 0.25"}
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({
                                    alpha: Number(value),
                                })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label={alphaSymbol + " decay rate"}
                            initialValue={values.decay || undefined}
                            persistAs='train-decay'
                            min={0.5}
                            max={1.0}
                            step={0.01}
                            placeholder='Set at 1 if no decay'
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ decay: Number(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Decay step, in episodes'
                            initialValue={values.step || undefined}
                            persistAs='train-step'
                            min={1000}
                            max={10000}
                            step={1000}
                            placeholder='1000 <= step <= 10000'
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ step: Number(value) })
                            }
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label={"Minimal " + alphaSymbol}
                            initialValue={values.minAlpha || undefined}
                            persistAs='train-minAlpha'
                            min={0}
                            max={0.05}
                            step={0.001}
                            placeholder={"min " + alphaSymbol + " <= 0.05"}
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ minAlpha: Number(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Train episodes'
                            initialValue={values.episodes || undefined}
                            persistAs='train-episodes'
                            min={values.isNew ? 0 : 5000}
                            max={100000}
                            step={5000}
                            placeholder='Blanc = just create Agent'
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
                        width='10rem'
                        background={palette.three}
                        color={palette.background}
                        onClick={handleTrain}
                        disabled={loading}
                    >
                        GO!
                    </Button>
                </div>
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
        </Modal>
    );
};

export default TrainModal;
