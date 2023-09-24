import { css } from "@emotion/react";
import { useState, useMemo } from "react";
import useSyncInitialValue from "../../hooks/useSyncInitialValue";
import { GLOBAL } from "../../utils/utils";

// Emotion styles
const makeEmotion = (
    width: string,
    labelFontSize: number,
    backgroundColor: string,
    color: string,
    textColor: string
) => css`
    display: flex;
    flex-direction: column;
    box-shadow: ${GLOBAL.littleShadow};
    border-radius: ${GLOBAL.borderRadius};
    padding: ${GLOBAL.padding};
    background-color: ${backgroundColor};
    color: ${color};
    width: ${width};
    font-size: ${labelFontSize}rem;
    & header {
        text-align: center;
        color: ${textColor};
        margin-bottom: ${GLOBAL.padding};
    }
    &:hover {
        box-shadow: ${GLOBAL.middleShadow};
    }
    &:hover header {
        font-weight: 500;
    }
`;
const makeControlWrapper = (innerWidth: string, controlSize: number) => css`
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
) => css`
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
    & ::selection {
        background-color: transparent;
    }
`;
const makeLine = (width: string, backgroundColor: string) => css`
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
const makeInputLine = (width: string, controlSize: number) => css`
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
 * @param start - minimum value
 * @param end - maximum value
 * @param step - step
 * @param initialValue - initial value
 * @param width - width
 * @param labelFontSize - font size of the label in rem
 * @param controlSizeRatio - ratio between thumb size and label font size
 * @param label - label
 * @param labelAbove - whether the label should be above or below range control
 * @param backgroundColor - background color
 * @param color - text color
 * @param controlColor - thumb color
 * @param onChange - function to be called when the value changes
 * @param debounceMs - debounce delay in ms
 */
export type RangeInputProps = {
    start: number;
    end: number;
    step?: number;
    initialValue?: number;
    width?: string;
    labelFontSize?: number;
    controlSizeRatio?: number;
    label?: string;
    labelColor?: string;
    labelAbove?: boolean;
    backgroundColor?: string;
    color?: string;
    controlColor?: string;
    onChange: (value: number) => void;
    debounceMs?: number;
};
const RangeInput = ({
    start,
    end,
    step,
    initialValue = undefined,
    width = "auto",
    labelFontSize = 1,
    controlSizeRatio = 3,
    label = "",
    labelColor,
    labelAbove = true,
    backgroundColor = "inherit",
    color = "inherit",
    controlColor = "rgb(50, 50, 224)",
    onChange,
    debounceMs = GLOBAL.windowResizeDelay,
}: RangeInputProps) => {
    const textColor = labelColor ?? color;
    const startValue = initialValue ?? start;
    const [value, setValue] = useSyncInitialValue(startValue);

    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        setValue(value);
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            onChange(value);
        }, debounceMs);
        setTimer(newTimer);
    };

    const controlSize = labelFontSize * controlSizeRatio;
    const lineWidth = `calc(100% + ${controlSize}rem)`;
    const innerWidth = `calc(100% - 2 * ${GLOBAL.padding} - ${controlSize}rem)`;

    const emotion = useMemo(
        () =>
            makeEmotion(
                width,
                labelFontSize,
                backgroundColor,
                color,
                textColor
            ),
        [width, labelFontSize, backgroundColor, color, textColor]
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

    const offset = ((value - start) / (end - start)) * 100;
    const control = css`
        ${controlBase}
        left: ${offset}%;
    `;
    const leftLine = makeLine(`${offset}%`, controlColor);

    return (
        <div css={emotion}>
            {labelAbove && <header>{label}</header>}
            <main css={controlWrapper}>
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
            </main>
            {!labelAbove && (
                <header>
                    <br />
                    {label}
                </header>
            )}
        </div>
    );
};

export default RangeInput;
