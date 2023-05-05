import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { uniqueId } from "lodash-es";
import { useOutsideClick } from "../../hooks/useClickAwayListener";
import { GLOBAL, SvgPaths } from "../../utils";
import Icon from "./Icon/Icon";

// Emotion styles
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
    display: flex;
    flex-direction: column;
    gap: 2px;
    box-shadow: ${GLOBAL.littleShadow};
    border-radius: ${GLOBAL.borderRadius};
    padding: ${GLOBAL.padding};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    font-size: ${fontSize * labelRatio}rem;
    font-weight: 500;
    &:hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
    & label {
        text-align: center;
        background: linear-gradient(135deg, ${labelColor1}, ${labelColor2});
        background-clip: text;
        text-fill-color: transparent;
    }
    & section {
        position: relative;
        width: 100%;
        font-size: ${fontSize}rem;
        appearance: none;
        outline: none;
        border: 0;
        border-radius: ${GLOBAL.borderRadius};
        border: 1px solid ${controlColor};
    }
    & aside {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    & main {
        width: 100%;
        padding: ${GLOBAL.padding};
        font-size: ${fontSize}rem;
        background-color: white;
        appearance: none;
        outline: none;
        border: 0;
        border-radius: ${GLOBAL.borderRadius};
    }
`;

interface SelectProps {
    width?: string;
    fontSize?: number;
    labelRatio?: number;
    backgroundColor?: string;
    labelColor1?: string;
    labelColor2?: string;
    controlColor?: string;
    color?: string;
    label?: string;
    optionValues: string[];
    initialValue?: string;
    onChange: (value: string) => void;
}
const Select = ({
    width = "auto",
    fontSize = 0.8,
    labelRatio = 1.25,
    backgroundColor = "inherit",
    labelColor1 = "black",
    labelColor2 = "black",
    controlColor = "",
    color = "inherit",
    label = "Select:",
    optionValues = [],
    initialValue = undefined,
    onChange,
}: SelectProps) => {
    const [optionsOpen, setOptionsOpen] = useState(false);
    const toggleOptions = () => setOptionsOpen(!optionsOpen);
    const ref = useOutsideClick(toggleOptions);

    const [value, setValue] = useState(initialValue || optionValues[0]);
    useEffect(() => {
        setValue(initialValue || optionValues[0]);
    }, [initialValue, optionValues]);

    const handleOption = (e: React.MouseEvent<HTMLDivElement>): void => {
        const currentValue = e.currentTarget.innerText;
        if (currentValue !== value) {
            setValue(currentValue);
            onChange(currentValue);
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

    const optionsBox = css`
        margin-top: 2px;
        background-color: pink;
        border-radius: ${GLOBAL.borderRadius} 0 0 ${GLOBAL.borderRadius};
        border: 1px 0 0 1px solid ${controlColor};
        width: 100%;
    `;

    return (
        <div css={emotion} ref={ref}>
            <label>{label}</label>
            <section onClick={toggleOptions}>
                <main>{value}</main>
                <aside>
                    <Icon
                        svg={
                            optionsOpen
                                ? SvgPaths.rightArrow
                                : SvgPaths.leftArrow
                        }
                        color={controlColor}
                    />
                </aside>
            </section>
            {optionsOpen && (
                <div css={optionsBox}>
                    {optionValues.map((v) => (
                        <div
                            key={uniqueId()}
                            css={
                                v === value
                                    ? css`
                                          background-color: yellow;
                                      `
                                    : null
                            }
                            onClick={handleOption}
                        >
                            {v}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
