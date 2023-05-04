import { css, SerializedStyles } from "@emotion/react";
import { useState, useContext, useEffect } from "react";
import { uniqueId } from "lodash-es";
import { UserContext } from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeEmotion = (
    width: string,
    color1: string,
    color2: string,
    color3: string,
    textColor: string
): SerializedStyles => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${GLOBAL.padding};
    width: ${width};
    background: linear-gradient(135deg, ${color1}, ${color2}, ${color3});
    font-weight: 500;
    color: ${textColor};
    width: ${width};
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
`;

const makeControl = (
    controlSize: number,
    controlColor: string
): SerializedStyles => css`
    appearance: none;
    position: relative;
    width: ${controlSize * 1.5}rem;
    height: ${controlSize}rem;
    border-radius: ${controlSize}rem;
    padding: ${controlSize * 0.1}rem;
    background-color: rgb(170, 170, 170);
    vertical-align: middle;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.1, 1.4);
    ::after {
        content: "";
        position: relative;
        display: block;
        left: 0;
        width: ${controlSize * 0.8}rem;
        height: 100%;
        border-radius: ${controlSize * 0.8}rem;
        background-color: white;
        transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            padding 0.3s ease, margin 0.3s ease;
        box-sizing: content-box;
    }
    :checked {
        background-color: ${controlColor};
    }
    :checked::after {
        left: ${controlSize * 0.5}rem;
    }
`;

/**
 * This function returns a checkbox component that can be used to render a checkbox in a UI
 * @param {string} width - The width of the checkbox component with label
 * @param {number} controlSize - The height of the checkbox
 * @param {string} controlColor - The color of the checkbox when "checked"
 * @param {string} color1 - colors for gradient on the component, set the same if no gradient
 * @param {string} color2 - or just don't provide any, and the background will be inherited
 * @param {string} color3
 * @param {string} textColor - The color of the label
 * @param {string} label - The label
 * @param {boolean} value - The initial state of "checked"
 * @param {function} onChange - The function that gets called when the checkbox toggled
 */
interface SelectProps {
    width?: string;
    controlSize?: number;
    controlColor?: string;
    color1?: string;
    color2?: string;
    color3?: string;
    textColor?: string;
    label?: string;
    onChange: (checked: string) => void;
}
const Select = ({
    width = "auto",
    controlSize = 1.2,
    controlColor = "rgb(50, 50, 224)",
    color1 = "inherit",
    color2 = "inherit",
    color3 = "inherit",
    textColor = "inherit",
    label = "",
    onChange,
}: SelectProps) => {
    const user = useContext(UserContext);
    const paletteName = user.paletteName;

    const [value, setValue] = useState(paletteName);
    useEffect(() => {
        setValue(paletteName);
    }, [paletteName]);

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setValue(value);
        onChange(value);
    };

    const emotion = makeEmotion(width, color1, color2, color3, textColor);
    const control = makeControl(controlSize, controlColor);

    const id = uniqueId("checkbox");

    return (
        <div css={emotion}>
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value} onChange={handleOnChange} />
        </div>
    );
};

export default Select;
