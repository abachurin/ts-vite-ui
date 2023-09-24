import { css } from "@emotion/react";
import { useState, useEffect, useCallback } from "react";
import {
    useUser,
    useUserUpdate,
    usePalette,
} from "../../contexts/UserProvider/UserContext";
import { connectAPI } from "../../api/requests";
import useAlertMessage from "../../hooks/useAlertMessage";
import { palettes } from "../../palette";
import { GLOBAL, changeBrightness } from "../../utils/utils";
import { AlignProps, Alignment, User } from "../../types";
import Modal from "../modal/Modal";
import ModalHeader from "../modal/ModalHeader";
import ModalBody from "../modal/ModalBody";
import ModalFooter from "../modal/ModalFooter";
import Button from "../base/Button/Button";
import Checkbox from "../base/Checkbox";
import RangeInput from "../base/RangeInput";
import Dropdown from "../base/Dropdown";

// Emotion styles
const emotion = css`
    margin-block: ${GLOBAL.padding};
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: ${GLOBAL.padding};
    & > section:nth-of-type(3),
    & > section:nth-of-type(4) {
        grid-column: 1 / span 2;
    }
    & > section {
        display: flex;
        flex-direction: column;
        gap: ${GLOBAL.padding};
        padding: ${GLOBAL.padding};
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
type UpdateUserValues = ValuesType & {
    name: string;
};

/**
 * Settings section.
 * @param align - alignment parameter of the open modal button
 */
const SettingsModal = ({ align }: AlignProps) => {
    const user = useUser();
    const palette = usePalette();
    const updateUser = useUserUpdate();

    const { message, createMessage } = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [currentValues, setCurrentValues] = useState<ValuesType>(
        getUserValues(user)
    );
    const updateValues = useCallback(
        (values: Partial<ValuesType>) =>
            setCurrentValues((prevValues) => ({ ...prevValues, ...values })),
        []
    );
    const updateAnimate = useCallback(
        (animate: boolean) => updateValues({ animate }),
        [updateValues]
    );
    const updateAnimationSpeed = useCallback(
        (animationSpeed: number) => updateValues({ animationSpeed }),
        [updateValues]
    );
    const updateLegends = useCallback(
        (legends: boolean) => updateValues({ legends }),
        [updateValues]
    );
    const updateSound = useCallback(
        (sound: boolean) => updateValues({ sound }),
        [updateValues]
    );
    const updateSoundLevel = useCallback(
        (soundLevel: number) => updateValues({ soundLevel }),
        [updateValues]
    );
    const updatePaletteName = useCallback(
        (paletteName: string) => updateValues({ paletteName }),
        [updateValues]
    );
    const resetValues = useCallback(
        () => updateValues(getUserValues(user)),
        [updateValues, user]
    );
    const updateUserValues = useCallback(
        () => updateUser(currentValues),
        [currentValues, updateUser]
    );

    // Fill settings fields with current User values
    useEffect(() => {
        setCurrentValues(getUserValues(user));
    }, [user]);

    // Save new User settings
    const saveUserValues = useCallback(
        async (values: UpdateUserValues) => {
            setLoading(true);
            const { error } = await connectAPI<UpdateUserValues, void>({
                method: "put",
                endpoint: "/users/settings",
                data: values,
            });
            if (error) {
                createMessage(error, "error", 3000);
            } else {
                createMessage("Settings updated!", "success", 3000);
            }
            setLoading(false);
        },
        [createMessage]
    );
    const updateAndSave = useCallback(() => {
        updateUser(currentValues);
        saveUserValues({
            name: user.name,
            ...currentValues,
        });
    }, [saveUserValues, currentValues, updateUser, user]);

    const checkboxParameters = {
        color1: changeBrightness(palette.two, 1.5),
        color2: palette.background,
        color3: changeBrightness(palette.one, 1.5),
        controlColor: palette.three,
    };
    const dropdownParameters = {
        backgroundColor: "white",
        labelColor1: palette.two,
        labelColor2: palette.one,
        controlColor: palette.three,
        alignOptions: "right" as Alignment,
    };
    const sliderParameters = {
        width: "100%",
        backgroundColor: "white",
        color: palette.text,
        controlColor: palette.three,
    };
    const headerText =
        user.name === "Login"
            ? "Guest settings"
            : `${user.name} personal settings`;

    return (
        <Modal
            button={{
                align: align,
                children: "Settings",
            }}
            modal={{
                width: "28rem",
                backgroundColor: palette.background,
                color: palette.text,
            }}
        >
            <ModalHeader>
                <h1
                    css={css`
                        color: ${palette.text};
                    `}
                >
                    {headerText}
                </h1>
            </ModalHeader>
            <ModalBody>
                <form css={emotion}>
                    <section>
                        <Checkbox
                            {...checkboxParameters}
                            label='Animation'
                            checked={currentValues.animate}
                            onChange={updateAnimate}
                        />
                        <Checkbox
                            {...checkboxParameters}
                            label='Sound'
                            checked={currentValues.sound}
                            onChange={updateSound}
                        />
                        <Checkbox
                            {...checkboxParameters}
                            label='Verbose'
                            checked={currentValues.legends}
                            onChange={updateLegends}
                        />
                    </section>
                    <section>
                        <Dropdown
                            {...dropdownParameters}
                            width='100%'
                            label='Palette'
                            optionValues={Object.keys(palettes)}
                            initialValue={currentValues.paletteName}
                            onChange={updatePaletteName}
                        />
                    </section>
                    <section>
                        <RangeInput
                            {...sliderParameters}
                            start={1}
                            end={10}
                            step={0.5}
                            initialValue={currentValues.animationSpeed}
                            label='Falcon speed'
                            onChange={updateAnimationSpeed}
                        />
                    </section>
                    <section>
                        <RangeInput
                            {...sliderParameters}
                            start={0}
                            end={1}
                            step={0.1}
                            initialValue={currentValues.soundLevel}
                            label='Sound level'
                            onChange={updateSoundLevel}
                        />
                    </section>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button
                    type='clickPress'
                    align='center'
                    background={palette.one}
                    color='white'
                    onClick={resetValues}
                >
                    Reset User Settings
                </Button>
                <Button
                    type='clickPress'
                    align='center'
                    background={palette.three}
                    color='white'
                    onClick={updateUserValues}
                >
                    Apply
                </Button>
                {user.name !== "Login" ? (
                    <Button
                        type='clickPress'
                        align='center'
                        background={palette.two}
                        color='white'
                        disabled={loading}
                        onClick={updateAndSave}
                    >
                        Apply and Save
                    </Button>
                ) : null}
            </ModalFooter>
            {message ? <ModalFooter>{message}</ModalFooter> : null}
        </Modal>
    );
};

export default SettingsModal;
