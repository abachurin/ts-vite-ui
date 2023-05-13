import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import {
    useUser,
    useAnimate,
} from "../../../contexts/UserProvider/UserContext";
import { useModalUpdate } from "../../../contexts/ModalProvider/ModalContext";
import {
    ChildrenProps,
    Alignment,
    ButtonVariants,
    ModalState,
} from "../../../types";
import { GLOBAL } from "../../../utils";
import { whooshRotateEmotion, whooshRotateClick } from "./whooshRotate";
import { clickPressEmotion, clickPressClick } from "./clickPress";

// Emotion styles
const buttonStyles = {
    whooshRotate: {
        style: whooshRotateEmotion,
        click: whooshRotateClick,
    },
    clickPress: {
        style: clickPressEmotion,
        click: clickPressClick,
    },
};

const makeContainer = (align: Alignment): SerializedStyles => css`
    display: flex;
    justify-content: ${align};
    align-items: center;
`;

const makeEmotion = (
    width: string,
    height: string,
    borderRadius: string,
    backgroundColor: string,
    color: string,
    fontSize: string
): SerializedStyles => css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-decoration: none;
    padding: ${GLOBAL.padding};
    border-radius: ${borderRadius || GLOBAL.borderRadius};
    background-color: ${backgroundColor};
    color: ${color};
    font-size: ${fontSize};
    width: ${width};
    height: ${height};
    :hover:enabled {
        cursor: pointer;
    }
    :disabled {
        cursor: not-allowed;
        color: rgb(128, 128, 128);
    }
`;

const makeLegend = (align: Alignment, legend: string): SerializedStyles => css`
    ${!window.matchMedia("(hover: none)").matches && legend
        ? `
            &::before {
                position: absolute;
                width: 10em;
                background-color: white;
                color: black;
                font-size: 0.7em;
                padding: ${GLOBAL.padding};
                content: attr(data-legend);
                white-space: wrap;
                text-align: left;
                transform: scale(0);
                transition: transform 0.25s;
            }
            &:hover:disabled::before {
                transform: scale(1);
            }
            ${
                align === "right"
                    ? `
                        &::before {
                            top: 2em;
                            right: 100%;
                        }
                    `
                    : `
                        &::before {
                            top: 110%;
                            left: 1em;
                        }
                    `
            }
        `
        : ""}
`;

/**
 * Returns a Button component with specified properties.
 *
 * @param type - The type of button, should be a member of ButtonVariants,
 * there should be .ts file describing style and default onClick behavior in Button folder,
 * it should be imported above buttonStyles object amended respectively.
 * @param align - The alignment of the button.
 * @param width - The width of the button.
 * @param height - The height of the button.
 * @param backgroundColor - The background color of the button.
 * @param color - The text color of the button.
 * @param fontSize - The font size of the button.
 * @param borderRadius - The CSS border radius of the button.
 * @param legend - The text to display when hovering over the button if it is disabled.
 * @param disabled - Whether the button is disabled.
 * @param level - The minimum user level required to click the button.
 * @param toggleModal - Whether the button should open or close a parent modal window.
 * @param onClick - The function to call when the button is clicked.
 * @param children - The child components to render within the button.
 * when clicked. Note, that this prop is actually used by the parent ModalWindow component,
 * but has to be declared here
 */
export interface ButtonProps extends ChildrenProps {
    type?: ButtonVariants;
    align?: Alignment;
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    borderRadius?: string;
    legend?: string;
    disabled?: boolean;
    level?: number;
    toggleModal?: ModalState;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = ({
    type = "whooshRotate",
    align = "left",
    width = "auto",
    height = "auto",
    backgroundColor = "inherit",
    color = "inherit",
    fontSize = "inherit",
    borderRadius = "",
    legend = "",
    disabled = false,
    level = 0,
    toggleModal = "none",
    onClick,
    children,
}: ButtonProps) => {
    const changeIsOpen = useModalUpdate();
    const user = useUser();
    const showLegend = user.legends;
    const animate = useAnimate();

    const container = useMemo(() => makeContainer(align), [align]);
    const emotion = useMemo(
        () => css`
            ${makeEmotion(
                width,
                height,
                borderRadius,
                backgroundColor,
                color,
                fontSize
            )}
            ${buttonStyles[type].style(borderRadius)},
            ${showLegend ? makeLegend(align, legend) : ""}
        `,
        [
            type,
            align,
            width,
            height,
            legend,
            backgroundColor,
            color,
            fontSize,
            borderRadius,
            showLegend,
        ]
    );

    const flash = useMemo(() => buttonStyles[type].click, [type]);

    return (
        <div css={container}>
            <button
                css={emotion}
                data-legend={legend}
                onClick={(e) => {
                    if (toggleModal !== "none") changeIsOpen(toggleModal);
                    flash(e.currentTarget as HTMLButtonElement, user, animate);
                    onClick && onClick(e);
                }}
                disabled={disabled || user.level < level}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
