import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { InputType } from "../../types";
import { GLOBAL } from "../../utils";

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
    standAlone: boolean,
    disabled: boolean,
    zIndex: number | "auto"
): SerializedStyles => css`
    padding: ${GLOBAL.padding};
    border-radius: ${standAlone ? "" : GLOBAL.borderRadius};
    box-shadow: ${standAlone ? "" : GLOBAL.littleShadow};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    font-size: ${fontSize}rem;
    opacity: ${disabled ? 0.7 : 1};
    z-index: ${zIndex};
    :hover {
        box-shadow: ${standAlone ? "" : GLOBAL.middleShadow};
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

interface InputProps {
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
    standAlone?: boolean;
    disabled?: boolean;
    zIndex?: number | "auto";
    onChange: (value: string | number) => void;
}
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
    placeholder = "",
    initialValue,
    standAlone = false,
    disabled = false,
    zIndex = "auto",
    onChange,
}: InputProps) => {
    const [value, setValue] = useState(initialValue || "");

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
        onChange(e.target.value);
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
                standAlone,
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
            standAlone,
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
