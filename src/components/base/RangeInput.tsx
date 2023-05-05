import { css, SerializedStyles } from "@emotion/react";
import { useState, useEffect, useMemo } from "react";
import { uniqueId } from "lodash-es";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeEmotion = (
    width: string,
    labelFontSize: number,
    backgroundColor: string,
    color: string
): SerializedStyles => css`
    display: flex;
    flex-direction: column;
    box-shadow: ${GLOBAL.littleShadow};
    border-radius: ${GLOBAL.borderRadius};
    padding: ${GLOBAL.padding};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    font-size: ${labelFontSize}rem;
    font-weight: 500;
    & label {
        text-align: center;
        margin-bottom: ${GLOBAL.padding};
    }
    &:hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
`;

const makeControlWrapper = (
    innerWidth: string,
    controlSize: number
): SerializedStyles => css`
    position: relative;
    width: ${innerWidth};
    margin-left: ${GLOBAL.padding};
    margin-right: ${controlSize}rem;
    height: ${controlSize}rem;
`;
const makeControl = (
    labelFontSize: number,
    controlColor: string,
    controlSize: number
): SerializedStyles => css`
    width: ${controlSize}rem;
    aspect-ratio: 1;
    border: 2px solid ${controlColor};
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: ${GLOBAL.littleShadow};
    font-size: ${labelFontSize * 0.8}rem;
    z-index: 100;
    transition: left 0.15s ease;
`;
const makeLine = (
    width: string,
    backgroundColor: string
): SerializedStyles => css`
    position: absolute;
    width: ${width};
    background-color: ${backgroundColor};
    top: 50%;
    transform: translateY(-50%);
    height: 2px;
    box-shadow: ${GLOBAL.littleShadow};
    margin-bottom: ${GLOBAL.padding};
    transition: width 0.15s ease;
`;

const makeInputLine = (
    width: string,
    controlSize: number
): SerializedStyles => css`
    position: absolute;
    width: calc(${width} - ${controlSize}rem * 0.7);
    height: ${controlSize}rem;
    left: calc(${controlSize}rem * 0.33);
    top: 50%;
    transform: translateY(-50%);
    margin-bottom: ${GLOBAL.padding};
    opacity: 0;
    cursor: pointer;
    z-index: 200;
`;

/**
 * RangeInput is a component that renders a range input with a label and some
 * optional styling.
 * @param start - Minimum value of the range.
 * @param end - Maximum value of the range.
 * @param step - Step between each value in the range.
 * @param initialValue - Initial value of the range.
 * @param width - Width of the component.
 * @param labelFontSize - Font size of the label in rem.
 * @param controlSizeRatio - Ratio between thumb size and label font size.
 * @param label - Label.
 * @param labelAbove - Whether the label should be above or below range control.
 * @param backgroundColor - Background color.
 * @param color - Text color.
 * @param controlColor - Thumb color
 * @param onChange - The function to be called when the value changes.
 */
interface RangeInputProps {
    start: number;
    end: number;
    step?: number;
    initialValue?: number;
    width?: string;
    labelFontSize?: number;
    controlSizeRatio?: 3;
    label?: string;
    labelAbove?: boolean;
    backgroundColor?: string;
    color?: string;
    controlColor?: string;
    onChange: (value: number) => void;
}
const RangeInput = ({
    start,
    end,
    step,
    initialValue = undefined,
    width = "auto",
    labelFontSize = 1,
    controlSizeRatio = 3,
    label = "",
    labelAbove = true,
    backgroundColor = "inherit",
    color = "inherit",
    controlColor = "rgb(50, 50, 224)",
    onChange,
}: RangeInputProps) => {
    const [value, setValue] = useState(initialValue ?? start);
    useEffect(() => {
        setValue(initialValue ?? start);
    }, [initialValue, start]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        setValue(value);
        onChange(value);
    };

    // styles depending only on props
    const controlSize = labelFontSize * controlSizeRatio;
    const lineWidth = `calc(100% + ${controlSize}rem)`;
    const innerWidth = `calc(100% - 2 * ${GLOBAL.padding} - ${controlSize}rem)`;

    const emotion = useMemo(
        () => makeEmotion(width, labelFontSize, backgroundColor, color),
        [width, labelFontSize, backgroundColor, color]
    );
    const controlWrapper = useMemo(
        () => makeControlWrapper(innerWidth, controlSize),
        [innerWidth, controlSize]
    );
    const controlBase = useMemo(
        () => makeControl(labelFontSize, controlColor, controlSize),
        [labelFontSize, controlColor, controlSize]
    );
    const inputLine = useMemo(
        () => makeInputLine(lineWidth, controlSize),
        [lineWidth, controlSize]
    );
    const fullLine = useMemo(
        () =>
            css`
                ${makeLine(lineWidth, "white")}
                opacity: 0,
                z-index: 3;
            `,
        [lineWidth]
    );

    // styles depending on input value
    const offset = ((value - start) / (end - start)) * 100;
    const control = css`
        ${controlBase}
        left: ${offset}%;
    `;
    const leftLine = makeLine(`${offset}%`, controlColor);

    const id = uniqueId("range-slider");
    return (
        <div css={emotion}>
            {labelAbove && <label htmlFor={id}>{label}</label>}
            <div css={controlWrapper}>
                <div css={control}>{value}</div>
                <div css={fullLine} />
                <div css={leftLine} />
                <input
                    type='range'
                    css={inputLine}
                    min={start}
                    max={end}
                    step={step}
                    value={value}
                    onChange={handleOnChange}
                />
            </div>
            {!labelAbove && <label htmlFor={id}>{label}</label>}
        </div>
    );
};

export default RangeInput;
