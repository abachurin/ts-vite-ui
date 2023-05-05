import { css } from "@emotion/react";
import { useContext, useState, useEffect } from "react";
import {
    User,
    UserContext,
    UserUpdateContext,
} from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import { GLOBAL, changeBrightness } from "../../utils";
import { AlignProps } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ModalFooter from "../modal/ModalFooter";
import Button from "../base/Button/Button";
import Checkbox from "../base/Checkbox";
import RangeInput from "../base/RangeInput";
import Select from "../base/Select";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    margin-block: ${GLOBAL.padding};
`;
const topHalf = css`
    display: flex;
    gap: calc(${GLOBAL.padding} * 2);
    & > :first-of-type {
        flex: 1;
    }
`;
const leftQuarter = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    &:hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
`;

// Helper functions
const getUserValues = (user: User) => {
    return {
        sound: user.sound,
        soundLevel: user.soundLevel,
        animate: user.animate,
        animationSpeed: user.animationSpeed,
        legends: user.legends,
        paletteName: user.paletteName,
    };
};

type ValuesType = ReturnType<typeof getUserValues>;

/**
 * Returns a Modal component with a button that displays a settings section.
 * @param align - The alignment parameter of the button, which opens the modal.
 */
const SettingsModal = ({ align }: AlignProps) => {
    const user = useContext(UserContext);
    const palette = palettes[user.paletteName];
    const updateUser = useContext(UserUpdateContext);

    // const [currentValues, setCurrentValues] = useInitialValue(userValues);

    const [currentValues, setCurrentValues] = useState<ValuesType>(
        getUserValues(user)
    );
    useEffect(() => {
        setCurrentValues(getUserValues(user));
    }, [user]);

    const updateValues = (values: Partial<ValuesType>) =>
        setCurrentValues({ ...currentValues, ...values });

    const headerText =
        user.name === "Login"
            ? "Guest settings"
            : `${user.name} personal settings`;
    const saveButton =
        user.name !== "Login" ? (
            <Button
                type='clickPress'
                align='center'
                backgroundColor={palette.two}
                color='white'
                onClick={() => console.log("saving user settings")}
            >
                Save
            </Button>
        ) : null;

    const headerStyle = css`
        color: ${palette.text};
    `;

    const brightOne = changeBrightness(palette.one, 1.5);
    const brightTwo = changeBrightness(palette.two, 1.5);

    const checkboxParameters = {
        color1: brightTwo,
        color2: palette.background,
        color3: brightOne,
        controlColor: palette.three,
    };
    const selectParameters = {
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
    };
    const sliderParameters = {
        width: "100%",
        backgroundColor: palette.background,
        color: palette.text,
        controlColor: palette.three,
    };

    return (
        <Modal
            button={{
                align: align,
                children: "Settings",
            }}
            modal={{
                width: "24em",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h1 css={headerStyle}>{headerText}</h1>
            </ModalHeader>
            <ModalBody>
                <form css={emotion}>
                    <div css={topHalf}>
                        <div css={leftQuarter}>
                            <Checkbox
                                {...checkboxParameters}
                                label='Animation'
                                checked={currentValues.animate}
                                onChange={(checked) =>
                                    updateValues({ animate: checked })
                                }
                            />
                            <Checkbox
                                {...checkboxParameters}
                                label='Sound'
                                checked={currentValues.sound}
                                onChange={(checked) =>
                                    updateValues({ sound: checked })
                                }
                            />
                            <Checkbox
                                {...checkboxParameters}
                                label='Verbose'
                                checked={currentValues.legends}
                                onChange={(checked) =>
                                    updateValues({ legends: checked })
                                }
                            />
                        </div>
                        <Select
                            {...selectParameters}
                            width='100%'
                            label='Palette'
                            optionValues={Object.keys(palettes)}
                            initialValue={currentValues.paletteName}
                            onChange={(value) =>
                                updateValues({ paletteName: value })
                            }
                        />
                    </div>
                    <RangeInput
                        {...sliderParameters}
                        start={1}
                        end={10}
                        step={0.5}
                        initialValue={currentValues.animationSpeed}
                        label='Falcon speed'
                        onChange={(value) =>
                            updateValues({ animationSpeed: value })
                        }
                    />
                    <RangeInput
                        {...sliderParameters}
                        start={0}
                        end={1}
                        step={0.1}
                        initialValue={currentValues.soundLevel}
                        label='Sound level'
                        onChange={(value) =>
                            updateValues({ soundLevel: value })
                        }
                    />
                </form>
            </ModalBody>
            <ModalFooter>
                <Button
                    type='clickPress'
                    align='center'
                    backgroundColor={palette.one}
                    color='white'
                    onClick={() => setCurrentValues(getUserValues(user))}
                >
                    Reset User Settings
                </Button>
                <Button
                    type='clickPress'
                    align='center'
                    backgroundColor={palette.three}
                    color='white'
                    onClick={() => updateUser(currentValues)}
                >
                    Apply
                </Button>
                {saveButton}
            </ModalFooter>
        </Modal>
    );
};

export default SettingsModal;
