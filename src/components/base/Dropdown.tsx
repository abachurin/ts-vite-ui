import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { uniqueId } from "lodash-es";
import { useOutsideClick } from "../../hooks/useClickAwayListener";
import { Alignment } from "../../types";
import { GLOBAL, SvgPaths } from "../../utils";
import Icon from "./Icon/Icon";

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
        font-size: ${fontSize * labelRatio}rem;
        background: linear-gradient(135deg, ${labelColor1}, ${labelColor2});
        background-clip: text;
        text-fill-color: transparent;
    }
    & > section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 100%;
        cursor: pointer;
        margin-top: ${GLOBAL.padding};
    }
`;
const thinGap = (
    <div
        css={css`
            height: 0.2rem;
        `}
    ></div>
);
const makeOptionsBox = (
    controlColor: string,
    backgroundColor: string
): SerializedStyles => css`
    position: absolute;
    min-width: 80%;
    width: max-content;
    border: 1px solid ${controlColor};
    border-top: none;
    border-radius: 0 0 ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
    background-color: ${backgroundColor};
    font-size: 0.8em;
    line-height: 0.9em;
    transform: scale(0);
    opacity: 0;
    transition: transform 0.25s ease, opacity 0.25s ease;
    z-index: 1000;
`;

const optionStyle = css`
    text-align: center;
    padding: ${GLOBAL.padding};
`;

/**
 * A dropdown component with configurable options.
 * @param width - Width.
 * @param fontSize - Font size.
 * @param labelRatio - Ratio of label size to font size.
 * @param backgroundColor - Background color.
 * @param labelColor1 - colors 1-2 for gradient label text
 * @param labelColor2
 * @param controlColor - Color of the dropdown control.
 * @param color - Text color.
 * @param label - Dropdown label.
 * @param optionValues - Array of values to display as dropdown options.
 * @param initialValue - The initially selected dropdown value, first option as default.
 * @param alignOptions - Alignment of the options box ("left" or "right").
 * @param onChange - Function to be called when dropdown value changes.
 */
interface DropdownProps {
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
    alignOptions?: Alignment;
    onChange: (value: string) => void;
}
const Dropdown = ({
    width = "auto",
    fontSize = 1,
    labelRatio = 0.8,
    backgroundColor = "inherit",
    labelColor1 = "black",
    labelColor2 = "black",
    controlColor = "",
    color = "inherit",
    label = "Select:",
    optionValues = [],
    initialValue = undefined,
    alignOptions = "left",
    onChange,
}: DropdownProps) => {
    const [optionsOpen, setOptionsOpen] = useState(0);
    const ref = useOutsideClick(() => setOptionsOpen(0));

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

    const optionsBoxBase = useMemo(
        () => makeOptionsBox(controlColor, backgroundColor),
        [controlColor, backgroundColor]
    );
    const optionsBoxAlignment =
        alignOptions === "left"
            ? css`
                  left: 0;
              `
            : css`
                  right: 0;
              `;
    const optionsBox = css`
        ${optionsBoxBase}
        ${optionsBoxAlignment}
        opacity: ${optionsOpen ? 1 : 0};
        transform: ${optionsOpen ? "scale(1)" : "scale(0)"};
    `;

    return (
        <div css={container} ref={ref}>
            <main css={emotion}>
                <header>
                    <label>{label}</label>
                </header>
                <section onClick={() => setOptionsOpen(1 - optionsOpen)}>
                    <div>{value}</div>
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
            </main>
            {thinGap}
            <div css={optionsBox}>
                {optionValues.map((v) => (
                    <div
                        key={uniqueId()}
                        css={
                            v === value
                                ? css`
                                      ${optionStyle}
                                      font-weight: 500;
                                  `
                                : optionStyle
                        }
                        onClick={handleOption}
                    >
                        {v}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropdown;
