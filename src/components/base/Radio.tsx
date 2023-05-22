import { css, SerializedStyles } from "@emotion/react";
import { useState, useEffect } from "react";
import { ReactNode, useMemo } from "react";
import { GLOBAL } from "../../utils";
import { uniqueId } from "lodash-es";

// Emotion styles
const makeEmotion = (
    width: string,
    fontSize: number,
    labelRatio: number,
    controlColor: string,
    color1: string,
    color2: string,
    textColor: string
): SerializedStyles => css`
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
    border: 1px solid ${controlColor};
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
    & > main {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        width: 100%;
    }
`;

const makeControl = (
    controlColor: string,
    textColor: string,
    fontSize: number
): SerializedStyles => css`
    padding-block: ${GLOBAL.padding};
    display: flex;
    align-items: center;
    & > input {
        position: relative;
        appearance: none;
        cursor: pointer;
        width: ${fontSize * 0.8}rem;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 1px solid ${controlColor};
        background-color: red;
    }
    & > div {
        content: "";
        position: absolute;
        display: block;
        width: ${fontSize * 1.2}rem;
        aspect-ratio: 1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        appearance: none;
        cursor: pointer;
        border-radius: 50%;
        background-color: ${controlColor};
    }
    & > input:checked {
        background-color: ${controlColor};
    }
    & > div input:checked {
        background-color: red;
    }

    & > aside {
        margin-left: ${GLOBAL.padding};
        color: ${textColor};
    }
`;

type RadioProps = {
    width?: string;
    fontSize?: number;
    labelRatio?: number;
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
    controlColor = "rgb(50, 50, 224)",
    color1 = "inherit",
    color2 = "inherit",
    textColor = "inherit",
    label = "",
    initialValue = undefined,
    options,
    onChange,
}: RadioProps) => {
    const [value, setValue] = useState(initialValue ?? options[0]);
    useEffect(() => {
        setValue(initialValue ?? options[0]);
    }, [initialValue, options]);

    const handleChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setValue(e.target.value);
        console.log(e.target.value);
    };

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
        () => makeControl(controlColor, textColor, fontSize),
        [controlColor, textColor, fontSize]
    );

    const renderOption = (option: string): ReactNode => {
        const id = uniqueId("radio");
        const key = uniqueId("option");
        return (
            <div css={control} key={key}>
                <input
                    type='radio'
                    id={id}
                    name='radio'
                    value={option}
                    onChange={handleChoice}
                ></input>
                <label css={label} htmlFor={id}>
                    {option}
                </label>
            </div>
        );
    };

    return (
        <form css={emotion}>
            <header>
                <div>{label}</div>
            </header>
            <main>{options.map(renderOption)}</main>
        </form>
    );
};

export default Radio;
