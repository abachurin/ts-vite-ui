import { css } from "@emotion/react";
import { useContext, useState, useEffect } from "react";
import {
    User,
    UserContext,
    UserUpdateContext,
    defaultUser,
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
    padding-block: ${GLOBAL.padding};
`;
const topHalf = css`
    display: flex;
    gap: ${GLOBAL.padding};
    & > :first-of-type {
        flex: 1;
    }
`;
const checkboxBlock = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
`;

// Helper functions
const defaultValues = {
    sound: defaultUser.sound,
    soundLevel: defaultUser.soundLevel,
    animate: defaultUser.animate,
    animationSpeed: defaultUser.animationSpeed,
    legends: defaultUser.legends,
    paletteName: defaultUser.paletteName,
};
type ValuesType = typeof defaultValues;
const getUserValues = (user: User): ValuesType => {
    return {
        sound: user.sound,
        soundLevel: user.soundLevel,
        animate: user.animate,
        animationSpeed: user.animationSpeed,
        legends: user.legends,
        paletteName: user.paletteName,
    };
};

/**
 * Returns a Modal component with a button that displays a settings section.
 * @param align - The alignment parameter of the button, which opens the modal.
 */
const SettingsModal = ({ align }: AlignProps) => {
    const user = useContext(UserContext);
    const palette = palettes[user.paletteName];
    const updateUser = useContext(UserUpdateContext);

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

    const checkboxParameters = {
        width: "10em",
        color1: changeBrightness(palette.two, 1.5),
        color2: palette.background,
        color3: changeBrightness(palette.one, 1.5),
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
                        <div css={checkboxBlock}>
                            <Checkbox
                                {...checkboxParameters}
                                label='Animation'
                                checked={user.animate}
                                onChange={(checked) =>
                                    updateValues({ animate: checked })
                                }
                            />
                            <Checkbox
                                {...checkboxParameters}
                                label='Sound'
                                checked={user.sound}
                                onChange={(checked) =>
                                    updateValues({ sound: checked })
                                }
                            />
                            <Checkbox
                                {...checkboxParameters}
                                label='Verbose'
                                checked={user.legends}
                                onChange={(checked) =>
                                    updateValues({ legends: checked })
                                }
                            />
                        </div>
                        <Select
                            onChange={(value) =>
                                updateValues({ paletteName: value })
                            }
                        />
                    </div>

                    <br />
                    <RangeInput
                        {...sliderParameters}
                        start={1}
                        end={10}
                        step={0.5}
                        initialValue={user.animationSpeed}
                        label='Falcon speed'
                        onChange={(value) =>
                            updateValues({ animationSpeed: value })
                        }
                    />
                    <RangeInput
                        {...sliderParameters}
                        start={0}
                        end={1}
                        step={0.01}
                        initialValue={user.soundLevel}
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
                    onClick={() => updateUser(defaultValues)}
                >
                    Reset to Defaults
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
