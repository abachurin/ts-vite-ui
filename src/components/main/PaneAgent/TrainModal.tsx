import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useModeUpdate } from "../../../contexts/ModeProvider/ModeContext";
import {
    usePalette,
    useUser,
} from "../../../contexts/UserProvider/UserContext";
import { User, TrainingJob } from "../../../types";
import { GLOBAL } from "../../../utils";
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
const defaultParams = {
    N: undefined,
    alpha: undefined,
    decay: undefined,
    step: undefined,
    min_alpha: undefined,
    episodes: undefined,
    name: undefined,
    isNew: true,
};
const setDefaultValues = (user: User): TrainingJob => {
    return {
        ...defaultParams,
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

    const [values, setValues] = useState<TrainingJob>(setDefaultValues(user));
    useEffect(() => {
        setValues(setDefaultValues(user));
    }, [user]);

    const updateValues = (values: Partial<TrainingJob>) =>
        setValues((prevValues) => ({ ...prevValues, ...values }));

    const inputParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
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
                            placeholder='Letters, numbers, or underscore, max 12 symbols'
                            initialValue={values.name}
                            onChange={(value: string | number) =>
                                updateValues({ name: value as string })
                            }
                        />
                    ) : (
                        <Dropdown
                            {...inputParameters}
                            label='Existing Agent Name'
                            optionValues={[]}
                            onChange={(value: string | number) =>
                                updateValues({ name: value as string })
                            }
                            zIndex={30}
                        />
                    )}
                    <section>
                        <Dropdown
                            {...inputParameters}
                            label='Signature N'
                            optionValues={[2, 3, 4]}
                            alignOptions='right'
                            initialValue={values.N}
                            onChange={(value: string | number) =>
                                updateValues({ N: value as number })
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
                            initialValue={values.alpha}
                            onChange={(value: string | number) =>
                                console.log(value + " 2")
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
                            initialValue={values.decay}
                            onChange={(value: string | number) =>
                                updateValues({ decay: value as number })
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
                            initialValue={values.step}
                            onChange={(value: string | number) =>
                                updateValues({ step: value as number })
                            }
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
                            initialValue={values.min_alpha}
                            onChange={(value: string | number) =>
                                updateValues({ min_alpha: value as number })
                            }
                            placeholder='No decay below this value'
                        />
                        <Input
                            {...inputParameters}
                            type='number'
                            label='Training episodes'
                            min={10000}
                            max={100000}
                            step={5000}
                            initialValue={values.episodes}
                            onChange={(value: string | number) =>
                                updateValues({ episodes: value as number })
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
                        onClick={() => console.log("GO!")}
                    >
                        GO!
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default TrainModal;
