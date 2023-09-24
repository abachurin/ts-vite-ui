import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useEffect } from "react";
import useSyncInitialValue from "../../hooks/useSyncInitialValue";
import { GLOBAL } from "../../utils/utils";
import { createPersistence } from "../../utils/persistence";

// Emotion styles
const makeEmotion = (
    width: string,
    fontSize: number,
    labelRatio: number,
    backgroundColor: string,
    color: string,
    labelColor1: string,
    labelColor2: string,
    controlColor: string,
    disabled: boolean,
    zIndex: number | "auto"
): SerializedStyles => css`
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    font-size: ${fontSize}rem;
    opacity: ${disabled ? 0.7 : 1};
    z-index: ${zIndex};
    :hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
    & > header {
        width: 100%;
        border-bottom: 1px solid ${controlColor};
    }
    & > header > div {
        width: max-content;
        font-size: ${fontSize * labelRatio}rem;
        background: linear-gradient(135deg, ${labelColor1}, ${labelColor2});
        background-clip: text;
        text-fill-color: transparent;
    }
    &:hover > header {
        font-weight: ${disabled ? "auto" : "500"};
    }
    & > input {
        border: none;
        color: ${color};
        font-size: ${fontSize}rem;
        width: 100%;
        cursor: ${disabled ? "default" : "pointer"};
        margin-top: ${GLOBAL.padding};
    }
    & > input:focus {
        appearance: none;
        outline: none;
    }
    & > input::placeholder {
        font-size: ${fontSize * labelRatio}rem;
        opacity: 0.7;
    }
`;

// Helper functions
type InputType =
    | "text"
    | "password"
    | "email"
    | "number"
    | "search"
    | "tel"
    | "url";

/**
 * Input component with customizable properties.
 * @param width - width
 * @param fontSize - font size in rem
 * @param labelRatio - ratio of the label width to font size
 * @param backgroundColor - =background color
 * @param labelColor1 - colors 1-2 for gradient label text
 * @param labelColor2
 * @param controlColor - color of the input control
 * @param color - text color
 * @param label - label
 * @param type - type of input
 * @param min - minimum value for numeric input types
 * @param max - maximum value for numeric input types
 * @param step - step value for numeric input types
 * @param placeholder - placeholder text for the input component
 * @param initialValue - initial value
 * @param disabled - specifies if the input component is disabled
 * @param persistAs - name for localStorage key to persist value, no persisting by default
 * @param zIndex - z-index
 * @param onChange - callback function for handling input changes
 */
export type InputProps = {
    width?: string;
    fontSize?: number;
    labelRatio?: number;
    backgroundColor?: string;
    labelColor1?: string;
    labelColor2?: string;
    controlColor?: string;
    color?: string;
    label?: string;
    type?: InputType;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    initialValue?: string | number;
    disabled?: boolean;
    persistAs?: string;
    zIndex?: number | "auto";
    onChange: (value: string) => void;
};
const Input = ({
    width = "auto",
    fontSize = 1,
    labelRatio = 0.8,
    backgroundColor = "inherit",
    labelColor1 = "black",
    labelColor2 = "black",
    controlColor = "",
    color = "inherit",
    label = "Input value:",
    type = "text",
    min,
    max,
    step,
    placeholder,
    initialValue,
    disabled = false,
    persistAs = "",
    zIndex = "auto",
    onChange,
}: InputProps) => {
    const startValue = initialValue ?? "";
    const [value, setValue] = useSyncInitialValue(startValue);

    const { setPersistedValue, getPersistedValue } =
        createPersistence(persistAs);
    if (persistAs && initialValue !== undefined) {
        setPersistedValue(initialValue.toString());
    }
    const storedValue = getPersistedValue();

    useEffect(() => {
        if (persistAs && initialValue === undefined) {
            setValue(storedValue);
            onChange(storedValue);
        }
    }, [initialValue, persistAs, onChange, storedValue, setValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange(newValue);
        if (persistAs) {
            setPersistedValue(newValue);
        }
    };

    const emotion = useMemo(
        () =>
            makeEmotion(
                width,
                fontSize,
                labelRatio,
                backgroundColor,
                color,
                labelColor1,
                labelColor2,
                controlColor,
                disabled,
                zIndex
            ),
        [
            width,
            fontSize,
            labelRatio,
            backgroundColor,
            color,
            labelColor1,
            labelColor2,
            controlColor,
            disabled,
            zIndex,
        ]
    );

    return (
        <div>
            <main css={emotion}>
                <header>
                    <div>{label}</div>
                </header>
                <input
                    type={type}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                />
            </main>
        </div>
    );
};

export default Input;
