import { css } from "@emotion/react";
import { ReactNode, useMemo, useCallback } from "react";
import useSyncInitialValue from "../../hooks/useSyncInitialValue";
import { useSoundVolume } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, makeSound } from "../../utils/utils";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const makeEmotion = (
    width: string,
    fontSize: number,
    labelRatio: number,
    controlColor: string,
    color1: string,
    color2: string,
    textColor: string
) => css`
    width: ${width};
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    background: white;
    color: ${textColor};
    font-size: ${fontSize}rem;
    &:hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
    & > header {
        width: 100%;
        border-bottom: 1px solid ${controlColor};
    }
    &:hover > header {
        font-weight: 500;
    }
    & > header > div {
        width: max-content;
        font-size: ${fontSize * labelRatio}rem;
        background: linear-gradient(135deg, ${color2}, ${color1});
        background-clip: text;
        text-fill-color: transparent;
    }
    & > ul {
        display: flex;
        gap: ${GLOBAL.padding};
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        width: 100%;
    }
`;

const makeControl = (
    backGroundColor: string,
    controlColor: string,
    textColor: string,
    fontSize: number
) => css`
    padding-block: ${GLOBAL.padding};
    display: flex;
    align-items: center;
    :hover,
    :hover * {
        cursor: pointer;
    }
    :hover label {
        font-weight: 500;
    }
    :hover input {
        box-shadow: 0 0 0.5em 0.1em ${controlColor};
    }
    & > label {
        padding-left: ${fontSize * 0.3}rem;
        color: ${textColor};
    }
    & > input {
        position: relative;
        margin: 0;
        appearance: none;
        width: ${fontSize * 1.2}rem;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 1px solid ${controlColor};
        background-color: ${backGroundColor};
    }
    & > input::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${fontSize * 0.6}rem;
        height: ${fontSize * 0.6}rem;
        border-radius: 50%;
        background-color: ${controlColor};
        opacity: 0;
    }
    & > input:checked::after {
        opacity: 1;
    }
`;

/**
 * Renders a radio button component with customizable options and styling.
 * @param width - width
 * @param fontSize - font size in rem
 * @param labelRatio - ratio of the label width to the control width
 * @param backgroundColor - background color
 * @param controlColor - color of the radio button control
 * @param color1 - colors 1-2 for gradient label text
 * @param color2
 * @param textColor - text color
 * @param label - label
 * @param initialValue - initial value
 * @param options - radio options
 * @param onChange - callback function to be called when the value of the radio button component changes
 */
export type RadioProps = {
    width?: string;
    fontSize?: number;
    labelRatio?: number;
    backgroundColor?: string;
    controlColor?: string;
    color1?: string;
    color2?: string;
    textColor?: string;
    label?: string;
    initialValue?: string | undefined;
    options: string[];
    onChange: (value: string) => void;
};
const Radio = ({
    width = "auto",
    fontSize = 1,
    labelRatio = 0.8,
    backgroundColor = "white",
    controlColor = "rgb(50, 50, 224)",
    color1 = "inherit",
    color2 = "inherit",
    textColor = "inherit",
    label = "",
    initialValue,
    options,
    onChange,
}: RadioProps) => {
    const volume = useSoundVolume();
    const [currentValue, setCurrentValue] = useSyncInitialValue(
        initialValue,
        (val) => val ?? options[0]
    );

    const handleChoice = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setCurrentValue(newValue);
            makeSound(clickSound, volume);
            onChange(newValue);
        },
        [volume, onChange, setCurrentValue]
    );

    const emotion = useMemo(
        () =>
            makeEmotion(
                width,
                fontSize,
                labelRatio,
                controlColor,
                color1,
                color2,
                textColor
            ),
        [width, fontSize, labelRatio, controlColor, color1, color2, textColor]
    );
    const control = useMemo(
        () => makeControl(backgroundColor, controlColor, textColor, fontSize),
        [backgroundColor, controlColor, textColor, fontSize]
    );

    const renderOption = useCallback(
        (option: string, idx: number): ReactNode => {
            return (
                <li css={control} key={idx}>
                    <input
                        type='radio'
                        name='radio'
                        value={option}
                        onChange={handleChoice}
                        checked={option === currentValue}
                    />
                    <aside></aside>
                    <label>{option}</label>
                </li>
            );
        },
        [control, currentValue, handleChoice]
    );

    return (
        <div css={emotion}>
            <header>
                <div>{label}</div>
            </header>
            <ul>{options.map(renderOption)}</ul>
        </div>
    );
};

export default Radio;
