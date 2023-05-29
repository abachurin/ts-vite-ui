import { css } from "@emotion/react";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { connectAPI } from "../../../api/utils";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
    useUserUpdate,
} from "../../../contexts/UserProvider/UserContext";
import useAlertMessage from "../../../hooks/useAlertMessage";
import { User, TrainingJob } from "../../../types";
import {
    GLOBAL,
    defaultTrainingParams,
    validateTrainingParams,
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

// Helper functions
const setDefaultValues = (user: User): TrainingJob => {
    return {
        ...defaultTrainingParams,
        user: user.name,
    };
};

/**
 * Returns a React Modal component containing the Admin section.
 * @param align - The alignment parameter of the button, which opens the modal
 */
const TrainModal = () => {
    const modeUpdate = useModeUpdate();
    const palette = usePalette();
    const user = useUser();
    const userUpdate = useUserUpdate();
    const [message, createMessage] = useAlertMessage("");

    const [values, setValues] = useState<TrainingJob>(setDefaultValues(user));
    useEffect(() => {
        setValues(setDefaultValues(user));
    }, [user]);

    const updateValues = useCallback((update: Partial<TrainingJob>) => {
        setValues((prevValues) => ({ ...prevValues, ...update }));
    }, []);

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };

    const agentMutation = useMutation(
        (values: TrainingJob) =>
            connectAPI<TrainingJob, string>({
                method: "post",
                endpoint: `/jobs/train`,
                data: values,
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
                        userUpdate({
                            job: "train",
                        });
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
            console.log(values);
            agentMutation.mutate(values);
        }
    };

    return (
        <Modal
            button={{
                background: palette.two,
                children: "Train",
                legend: "Register to unlock",
                level: GLOBAL.userLevel.user,
                onClick: () => {
                    modeUpdate({ agent: "train" });
                },
                disabled: user.job !== "none",
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
                        initialValue={"New"}
                        onChange={(value: string) =>
                            updateValues({ isNew: value === "New" })
                        }
                    />
                    {values.isNew ? (
                        <Input
                            {...inputParameters}
                            type='text'
                            label='New Agent Name'
                            placeholder={`Letters, numerals, dash, underscore, 1-${GLOBAL.maxNameLength} chars`}
                            initialValue={defaultTrainingParams.name}
                            onChange={(value) =>
                                updateValues({ name: String(value) })
                            }
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={[]}
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
                            optionValues={[2, 3, 4]}
                            initialValue={values.N}
                            alignOptions='right'
                            onChange={(value) =>
                                updateValues({ N: Number(value) })
                            }
                            zIndex={20}
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Learning Rate (Alpha)'
                            min={0.01}
                            max={0.25}
                            step={0.01}
                            initialValue={defaultTrainingParams.alpha}
                            onChange={(value) =>
                                updateValues({
                                    alpha: Number(value),
                                })
                            }
                            placeholder='0.01 <= &#945; <= 0.25'
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Alpha decay rate'
                            min={0.5}
                            max={1.0}
                            step={0.01}
                            initialValue={defaultTrainingParams.decay}
                            onChange={(value) =>
                                updateValues({ decay: Number(value) })
                            }
                            placeholder='Set at 1 if no decay'
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Decay step, in episodes'
                            min={1000}
                            max={10000}
                            step={1000}
                            initialValue={defaultTrainingParams.step}
                            onChange={(value) =>
                                updateValues({ step: Number(value) })
                            }
                            placeholder='1000 <= step <= 10000'
                        />
                    </section>
                    <section>
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Minimal Alpha'
                            min={0}
                            max={0.05}
                            step={0.001}
                            initialValue={defaultTrainingParams.minAlpha}
                            onChange={(value) =>
                                updateValues({ minAlpha: Number(value) })
                            }
                            placeholder='min &#945; <= 0.05'
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Training episodes'
                            min={values.isNew ? 0 : 5000}
                            max={100000}
                            step={5000}
                            initialValue={defaultTrainingParams.episodes}
                            onChange={(value) =>
                                updateValues({ episodes: Number(value) })
                            }
                            placeholder='0 to just create an Agent'
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
