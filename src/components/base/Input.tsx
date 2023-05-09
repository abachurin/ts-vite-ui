import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { uniqueId } from "lodash-es";
import { InputType } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeContainer = (
    color: string,
    width: string,
    fontSize: number
): SerializedStyles => css`
    position: relative;
    color: ${color};
    width: ${width};
    font-size: ${fontSize}rem;
    &:hover main {
        box-shadow: ${GLOBAL.middleShadow};
    }
    &:hover label {
        font-weight: 500;
    }
`;
const makeEmotion = (
    width: string,
    fontSize: number,
    labelRatio: number,
    backgroundColor: string,
    color: string,
    labelColor1: string,
    labelColor2: string,
    controlColor: string
): SerializedStyles => css`
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    & > header {
        width: 100%;
        border-bottom: 1px solid ${controlColor};
    }
    & > header > label {
        font-size: ${fontSize / labelRatio}rem;
        background: linear-gradient(135deg, ${labelColor1}, ${labelColor2});
        background-clip: text;
        text-fill-color: transparent;
    }
    & > input {
        border: none;
        color: ${color};
        font-size: ${fontSize}rem;
        width: 100%;
        cursor: pointer;
        margin-top: ${GLOBAL.padding};
    }
    &>input: focus {
        appearance: none;
        outline: none;
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
    step?: number;
    placeholder?: string;
    initialValue?: string | number;
    onChange: (value: string | number) => void;
}
const Input = ({
    width = "auto",
    fontSize = 1,
    labelRatio = 1.25,
    backgroundColor = "inherit",
    labelColor1 = "black",
    labelColor2 = "black",
    controlColor = "",
    color = "inherit",
    label = "Input value:",
    type = "text",
    step,
    placeholder = "",
    initialValue,
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

    const container = useMemo(
        () => makeContainer(color, width, fontSize),
        [color, width, fontSize]
    );
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
                controlColor
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
        ]
    );

    const id = uniqueId();
    return (
        <div css={container}>
            <main css={emotion}>
                <header>
                    <label htmlFor={id}>{label}</label>
                </header>
                <input
                    id={id}
                    type={type}
                    step={step}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
            </main>
        </div>
    );
};

export default Input;
