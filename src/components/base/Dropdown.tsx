import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { uniqueId } from "lodash-es";
import { useUser } from "../../contexts/UserProvider/UserContext";
import usePersistence from "../../hooks/usePersistence";
import { useOutsideClick } from "../../hooks/useClickAwayListener";
import { Alignment } from "../../types";
import { GLOBAL, SvgPaths, makeSound } from "../../utils";
import Icon from "./Icon/Icon";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const makeContainer = (
    color: string,
    width: string,
    fontSize: number,
    standAlone: boolean,
    zIndex: number | "auto"
): SerializedStyles => css`
    position: relative;
    color: ${color};
    width: ${width};
    font-size: ${fontSize}rem;
    z-index: ${zIndex};
    &:hover main {
        box-shadow: ${standAlone ? "" : GLOBAL.middleShadow};
    }
`;
const makeEmotion = (
    fontSize: number,
    labelRatio: number,
    backgroundColor: string,
    labelColor1: string,
    labelColor2: string,
    controlColor: string,
    standAlone: boolean,
    disabled: boolean
): SerializedStyles => css`
    padding: ${GLOBAL.padding};
    border-radius: ${standAlone ? "" : GLOBAL.borderRadius};
    box-shadow: ${standAlone ? "" : GLOBAL.littleShadow};
    background-color: ${backgroundColor};
    opacity: ${disabled ? 0.7 : 1};
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
    & > section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 100%;
        cursor: ${disabled ? "default" : "pointer"};
        margin-top: ${GLOBAL.padding};
    }
`;
const makeOptionsBox = (
    controlColor: string,
    backgroundColor: string,
    zIndex: number | "auto"
): SerializedStyles => css`
    position: absolute;
    min-width: 80%;
    width: max-content;
    border: 1px solid ${controlColor};
    border-top: 1px dotted ${controlColor};
    border-radius: 0 0 ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
    background-color: ${backgroundColor};
    font-size: 0.8em;
    line-height: 0.9em;
    z-index: ${zIndex === "auto" ? "auto" : zIndex + 1};
    transform: scale(0);
    opacity: 0;
    transition: transform 0.25s ease, opacity 0.25s ease;
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
    optionValues: string[] | number[];
    initialValue?: string | number;
    alignOptions?: Alignment;
    standAlone?: boolean;
    disabled?: boolean;
    name?: string;
    zIndex?: number | "auto";
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
    standAlone = false,
    disabled = false,
    name = "",
    zIndex = "auto",
    onChange,
}: DropdownProps) => {
    const user = useUser();
    const disabledTrue = disabled || optionValues.length === 0;
    const [optionsOpen, setOptionsOpen] = useState(false);
    const ref = useOutsideClick(() => setOptionsOpen(false));

    const startName = initialValue || optionValues[0];
    const [value, setValue] = useState(startName);

    const [persistedValue, setPersistedValue] = usePersistence(name);
    useEffect(() => {
        if (name && persistedValue) {
            onChange(persistedValue);
        }
    }, [persistedValue]);

    const displayValue = name
        ? persistedValue === GLOBAL.filler
            ? initialValue ?? ""
            : persistedValue
        : value;

    const handleOption = (e: React.MouseEvent<HTMLDivElement>): void => {
        const currentValue = e.currentTarget.innerText;
        if (currentValue !== value) {
            makeSound(clickSound, user);
            if (name) {
                setPersistedValue(currentValue);
            } else {
                setValue(currentValue);
            }
            onChange(currentValue);
        }
    };

    const container = useMemo(
        () => makeContainer(color, width, fontSize, standAlone, zIndex),
        [color, width, fontSize, standAlone, zIndex]
    );
    const emotion = useMemo(
        () =>
            makeEmotion(
                fontSize,
                labelRatio,
                backgroundColor,
                labelColor1,
                labelColor2,
                controlColor,
                standAlone,
                disabledTrue
            ),
        [
            fontSize,
            labelRatio,
            backgroundColor,
            labelColor1,
            labelColor2,
            controlColor,
            standAlone,
            disabledTrue,
        ]
    );

    const optionsBoxBase = useMemo(
        () => makeOptionsBox(controlColor, backgroundColor, zIndex),
        [controlColor, backgroundColor, zIndex]
    );
    const optionsBoxAlignment =
        alignOptions === "left"
            ? css`
                  left: 0;
              `
            : css`
                  right: 0;
              `;

    const showOptions = optionsOpen && !disabledTrue;
    const optionsBox = css`
        ${optionsBoxBase}
        ${optionsBoxAlignment}
        opacity: ${showOptions ? 1 : 0};
        transform: ${showOptions ? "scale(1)" : "scale(0)"};
    `;

    return (
        <div css={container} ref={ref}>
            <main css={emotion}>
                <header>
                    <div>{label}</div>
                </header>
                <section onClick={() => setOptionsOpen((prev) => !prev)}>
                    <div>{displayValue}</div>
                    <aside>
                        <Icon
                            svg={
                                showOptions
                                    ? SvgPaths.rightArrow
                                    : SvgPaths.leftArrow
                            }
                            rescaleFactor={0.8}
                            color={controlColor}
                        />
                    </aside>
                </section>
            </main>
            <div css={optionsBox}>
                {optionValues.map((v) => (
                    <div
                        key={uniqueId()}
                        css={
                            v === displayValue
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
