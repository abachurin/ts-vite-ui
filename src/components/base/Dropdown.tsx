import { css } from "@emotion/react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSoundVolume } from "../../contexts/UserProvider/UserContext";
import useSyncInitialValue from "../../hooks/useSyncInitialValue";
import { useClickAwayListener } from "../../hooks/useClickAwayListener";
import { Alignment } from "../../types";
import { GLOBAL, SvgPaths, makeSound } from "../../utils/utils";
import { createPersistence } from "../../utils/persistence";
import Icon from "./Icon/Icon";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const makeContainer = (
    color: string,
    width: string,
    fontSize: number,
    zIndex: number | "auto"
) => css`
    position: relative;
    color: ${color};
    width: ${width};
    font-size: ${fontSize}rem;
    z-index: ${zIndex};
    &:hover main {
        box-shadow: ${GLOBAL.middleShadow};
    }
`;
const makeEmotion = (
    fontSize: number,
    labelRatio: number,
    backgroundColor: string,
    labelColor1: string,
    labelColor2: string,
    controlColor: string,
    disabled: boolean
) => css`
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
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
    & > footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 100%;
        font-weight: 400;
        cursor: ${disabled ? "default" : "pointer"};
        margin-top: ${GLOBAL.padding};
    }
`;
const makeOptionsBox = (
    controlWidthRatio: number,
    controlColor: string,
    backgroundColor: string,
    zIndex: number | "auto"
) => css`
    position: absolute;
    min-width: ${controlWidthRatio}%;
    width: max-content;
    border: 1px solid ${controlColor};
    border-top: 1px dotted ${controlColor};
    border-radius: 0 0 ${GLOBAL.borderRadius} ${GLOBAL.borderRadius};
    background-color: ${backgroundColor};
    font-size: 0.8em;
    line-height: 1.5em;
    z-index: ${zIndex === "auto" ? "auto" : zIndex + 1};
    transform: scale(0);
    opacity: 0;
    transition: transform 0.25s ease, opacity 0.25s ease;
`;

const optionStyle = css`
    text-align: center;
    padding: ${GLOBAL.padding};
    font-weight: 300;
`;
const chosenOptionStyle = css`
    ${optionStyle}
    font-weight: 500;
`;

/**
 * A Dropdown Input component with configurable options.
 * @param width - width
 * @param fontSize - font size
 * @param labelRatio - ratio of label size to font size
 * @param backgroundColor - background color
 * @param labelColor1 - colors 1-2 for gradient label text
 * @param labelColor2
 * @param controlWidthRatio - ratio of control size to font size
 * @param controlColor - color of the dropdown control
 * @param color - text color
 * @param label - label
 * @param optionValues - array of values to display as dropdown options
 * @param initialValue - initial value, first option as default
 * @param alignOptions - alignment of the options box ("left" or "right")
 * @param alwaysOpen - whether the options box should always be open
 * @param disabled - whether the dropdown is disabled
 * @param persistAs - name for localStorage key to persist value, no persisting by default
 * @param zIndex - z-index of component
 * @param onChange - function to be called when dropdown value changes.
 */
export type DropdownProps = {
    width?: string;
    fontSize?: number;
    labelRatio?: number;
    backgroundColor?: string;
    labelColor1?: string;
    labelColor2?: string;
    controlWidthRatio?: number;
    controlColor?: string;
    color?: string;
    label?: string;
    optionValues: string[];
    initialValue?: string | number;
    alignOptions?: Alignment;
    alwaysOpen?: boolean;
    disabled?: boolean;
    persistAs?: string;
    zIndex?: number | "auto";
    onChange: (value: string) => void;
};
const Dropdown = ({
    width = "auto",
    fontSize = 1,
    labelRatio = 0.8,
    backgroundColor = "inherit",
    labelColor1 = "black",
    labelColor2 = "black",
    controlWidthRatio = 80,
    controlColor = "",
    color = "inherit",
    label = "Select:",
    optionValues = [],
    initialValue = "",
    alignOptions = "left",
    alwaysOpen = false,
    disabled = false,
    persistAs = "",
    zIndex = "auto",
    onChange,
}: DropdownProps) => {
    const volume = useSoundVolume();

    const disabledTrue = disabled || optionValues.length === 0;
    const [optionsOpen, setOptionsOpen] = useState(alwaysOpen);
    const closeOptionBox = useCallback(() => setOptionsOpen(false), []);
    const ref = useClickAwayListener(closeOptionBox);

    const startValue = optionValues.includes(initialValue.toString())
        ? initialValue.toString()
        : "";

    const { setPersistedValue, getPersistedValue } =
        createPersistence(persistAs);
    if (persistAs && startValue !== "") {
        setPersistedValue(startValue);
    }

    const [value, setValue] = useState(startValue);
    const updateValue = useCallback(
        (newValue: string) => {
            setValue(newValue);
            onChange(newValue);
        },
        [onChange]
    );

    const change = startValue !== initialValue || startValue !== value;
    const storedValue = getPersistedValue();
    const actualStored = optionValues.includes(storedValue) ? storedValue : "";

    useEffect(() => {
        if (persistAs) {
            if (startValue === "") updateValue(actualStored);
            else if (change) updateValue(startValue);
        } else if (change) updateValue(startValue);
    }, [change, persistAs, updateValue, startValue, actualStored]);

    const handleOption = (e: React.MouseEvent<HTMLLIElement>): void => {
        const newValue = e.currentTarget.innerText;
        makeSound(clickSound, volume);
        setValue(newValue);
        onChange(newValue);
        if (persistAs) {
            setPersistedValue(newValue);
        }
        if (!alwaysOpen) setOptionsOpen(false);
    };

    const container = useMemo(
        () => makeContainer(color, width, fontSize, zIndex),
        [color, width, fontSize, zIndex]
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
                disabledTrue
            ),
        [
            fontSize,
            labelRatio,
            backgroundColor,
            labelColor1,
            labelColor2,
            controlColor,
            disabledTrue,
        ]
    );

    const optionsBoxBase = useMemo(
        () =>
            makeOptionsBox(
                controlWidthRatio,
                controlColor,
                backgroundColor,
                zIndex
            ),
        [controlWidthRatio, controlColor, backgroundColor, zIndex]
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
                <footer
                    onClick={() => {
                        if (!alwaysOpen) setOptionsOpen((prev) => !prev);
                    }}
                >
                    <div>{value}</div>
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
                </footer>
            </main>
            <ul css={optionsBox}>
                {optionValues.map((v, idx) => (
                    <li
                        key={idx}
                        css={v == value ? chosenOptionStyle : optionStyle}
                        onClick={handleOption}
                    >
                        {v}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
