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
`;

// Helper functions
const defaultParams = {
    N: 4,
    alpha: 0.2,
    decay: 0.95,
    step: 1000,
    min_alpha: 0.01,
    episodes: 10000,
};
const setDefaultValues = (user: User) => {
    return {
        ...defaultParams,
        name: user.name,
        isNew: true,
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
    const dropdownParameters = {
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
                        controlColor={palette.three}
                        color1={palette.two}
                        color2={palette.one}
                        label={"Train new / keep training existing Agent"}
                        options={["New", "Existing"]}
                        onChange={(value: string) =>
                            updateValues({ isNew: value === "New" })
                        }
                    />
                    <Input
                        {...inputParameters}
                        onChange={(value: string | number) =>
                            console.log(value + " 1")
                        }
                        placeholder='Name'
                    />
                    <Input
                        {...inputParameters}
                        onChange={(value: string | number) =>
                            console.log(value + " 2")
                        }
                        placeholder='Name'
                    />
                    <Input
                        {...inputParameters}
                        onChange={(value: string | number) =>
                            console.log(value + " 3")
                        }
                        placeholder='Name'
                    />
                    <Dropdown
                        {...dropdownParameters}
                        onChange={(value: string | number) =>
                            console.log(value) + " 4"
                        }
                        optionValues={["one", "two", "three"]}
                        alignOptions='right'
                        zIndex={20}
                    />
                    <Input
                        {...inputParameters}
                        onChange={(value: string | number) =>
                            console.log(value + " 5")
                        }
                        placeholder='Name'
                    />
                    <Dropdown
                        {...dropdownParameters}
                        onChange={(value: string | number) =>
                            console.log(value) + " 6"
                        }
                        optionValues={["one", "two", "three"]}
                        alignOptions='right'
                        zIndex={10}
                    />
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
