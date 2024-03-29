import { css } from "@emotion/react";
import useSyncInitialValue from "../../hooks/useSyncInitialValue";
import { useSoundVolume } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, makeSound } from "../../utils/utils";
import clickSound from "../../assets/sounds/mixkit-gate-latch-click-1924.wav";

// Emotion styles
const makeEmotion = (
    width: string,
    fontSize: number,
    color1: string,
    color2: string,
    color3: string,
    textColor: string
) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${GLOBAL.padding};
    width: ${width};
    background: linear-gradient(135deg, ${color1}, ${color2}, ${color3});
    color: ${textColor};
    width: ${width};
    padding: ${GLOBAL.padding};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.littleShadow};
    font-size: ${fontSize}rem;
    :hover {
        font-weight: 500;
        box-shadow: ${GLOBAL.middleShadow};
    }
`;

const makeControl = (controlSize: number, controlColor: string) => css`
    appearance: none;
    position: relative;
    width: ${controlSize * 1.5}rem;
    height: ${controlSize}rem;
    border-radius: ${controlSize}rem;
    padding: ${controlSize * 0.1}rem;
    background-color: rgb(170, 170, 170);
    vertical-align: middle;
    cursor: pointer;
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
    :disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

/**
 * This function returns a checkbox component that can be used to render a checkbox in a UI
 * @param width - width
 * @param controlSize - height
 * @param controlColor - color of the checkbox when "checked"
 * @param color1 - colors for gradient on the component, set the same if no gradient
 * @param color2 - or just don't provide any, and the background will be inherited
 * @param color3
 * @param textColor - color of the label
 * @param fontSize - font size of label, in rem
 * @param checked - initial state of "checked"
 * @param label - label
 * @param onChange - function that gets called when the checkbox is toggled
 */
export type CheckboxProps = {
    width?: string;
    controlSize?: number;
    controlColor?: string;
    color1?: string;
    color2?: string;
    color3?: string;
    textColor?: string;
    fontSize?: number;
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    onChange: (checked: boolean) => void;
};
const Checkbox = ({
    width = "auto",
    controlSize = 1.2,
    controlColor = "rgb(50, 50, 224)",
    color1 = "inherit",
    color2 = "inherit",
    color3 = "inherit",
    textColor = "inherit",
    fontSize = 1,
    checked = false,
    disabled = false,
    label = "",
    onChange,
}: CheckboxProps) => {
    const volume = useSoundVolume();

    const [isChecked, setIsChecked] = useSyncInitialValue(checked);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        makeSound(clickSound, volume);
        onChange(checked);
    };

    const emotion = makeEmotion(
        width,
        fontSize,
        color1,
        color2,
        color3,
        textColor
    );
    const control = makeControl(controlSize, controlColor);

    return (
        <div css={emotion}>
            <label>{label}</label>
            <input
                type='checkbox'
                css={control}
                checked={isChecked}
                disabled={disabled}
                onChange={handleOnChange}
            />
        </div>
    );
};

export default Checkbox;
