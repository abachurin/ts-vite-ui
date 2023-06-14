import { css } from "@emotion/react";
import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { connectAPI } from "../../../api/utils";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import useJobDescription from "../../../hooks/useJobDescription";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { AgentTraining } from "../../../types";
import {
    GLOBAL,
    defaultTrainingParams,
    validateTrainingParams,
    simulateCloseModalClick,
} from "../../../utils";
import Modal from "../../modal/Modal";
import ModalHeader from "../../modal/ModalHeader";
import ModalBody from "../../modal/ModalBody";
import ModalFooter from "../../modal/ModalFooter";
import Input from "../../base/Input";
import Dropdown from "../../base/Dropdown";
import Radio from "../../base/Radio";
import Button from "../../base/Button/Button";

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
    const job = useJobDescription(user.name);
    const [message, createMessage] = useAlertMessage("");

    const [values, setValues] = useState<AgentTraining>(defaultTrainingParams);

    const updateValues = useCallback((update: Partial<AgentTraining>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const agentMutation = useMutation(
        (values: AgentTraining) =>
            connectAPI<AgentTraining, string>({
                method: "post",
                endpoint: `/jobs/train`,
                data: { ...values, user: user.name },
            }),
        {
            onSuccess: ({ result, error }) => {
                if (error) {
                    createMessage(error, "error");
                } else {
                    if (result !== "ok") {
                        createMessage(result, "error");
                    } else {
                        const message = values.isNew
                            ? `Agent created${
                                  (values.episodes as number) > 0
                                      ? ", training commenced, follow the logs"
                                      : ""
                              }`
                            : "Training resumed, follow the logs";
                        createMessage(message, "success");
                        modeUpdate({ agent: "train" });
                        setTimeout(() => {
                            simulateCloseModalClick();
                        }, 3000);
                    }
                }
            },
        }
    );

    const finalMessage = agentMutation.isLoading ? "Loading..." : message;

    const handleTrain = () => {
        const [validated, change] = validateTrainingParams(values);
        setValues((prevValues) => ({ ...prevValues, ...validated }));
        if (change) {
            createMessage(
                "Some parameters are invalid or undefined. Please follow the instructions.",
                "error"
            );
        } else {
            agentMutation.mutate(values);
        }
    };

    return (
        <Modal
            button={{
                background: palette.two,
                children: "Train",
                legend: "Only for registered users",
                level: GLOBAL.userLevel.user,
                disabled: job !== null || user.name === "Login",
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
                        onChange={(value: string) =>
                            updateValues({ isNew: value === "New" })
                        }
                    />
                    {values.isNew ? (
                        <Input
                            {...inputParameters}
                            type='text'
                            label='New Agent Name'
                            name='train-new-name'
                            placeholder={`Letters, numerals, dash, underscore, 1-${GLOBAL.maxNameLength} chars`}
                            onChange={(value) =>
                                updateValues({ name: String(value) })
                            }
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={[]}
                            name='train-existing-name'
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
                            name='train-N'
                            optionValues={[2, 3, 4]}
                            initialValue={2}
                            disabled={!values.isNew}
                            alignOptions='right'
                            onChange={(value) =>
                                updateValues({ N: Number(value) })
                            }
                            zIndex={20}
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Initial Learning Rate (&#945;)'
                            name='train-alpha'
                            min={0.1}
                            max={0.25}
                            step={0.01}
                            placeholder='0.10 <= &#945; <= 0.25'
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
                            label='&#945; decay rate'
                            name='train-decay'
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
                            name='train-step'
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
                            label='Minimal &#945;'
                            name='train-minAlpha'
                            min={0}
                            max={0.05}
                            step={0.001}
                            placeholder='min &#945; <= 0.05'
                            disabled={!values.isNew}
                            onChange={(value) =>
                                updateValues({ minAlpha: Number(value) })
                            }
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Training episodes'
                            name='train-episodes'
                            min={values.isNew ? 0 : 5000}
                            max={100000}
                            step={5000}
                            disabled={!values.isNew}
                            placeholder='0 to just create an Agent'
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
                    >
                        GO!
                    </Button>
                </div>
            </ModalFooter>
            {finalMessage ? <ModalFooter>{finalMessage}</ModalFooter> : null}
        </Modal>
    );
};

export default TrainModal;
