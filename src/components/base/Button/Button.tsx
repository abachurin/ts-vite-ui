import { css } from "@emotion/react";
import React, { useMemo } from "react";
import {
    useUser,
    useAnimate,
    useSoundVolume,
} from "../../../contexts/UserProvider/UserContext";
import { useModalUpdate } from "../../../contexts/ModalProvider/ModalContext";
import {
    ChildrenProps,
    Alignment,
    ButtonVariants,
    ModalState,
} from "../../../types";
import { GLOBAL } from "../../../utils/utils";
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

const makeContainer = (align: Alignment) => css`
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
) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    text-decoration: none;
    padding: ${GLOBAL.padding};
    border-radius: ${borderRadius || GLOBAL.borderRadius};
    background: ${backgroundColor};
    color: ${color};
    font-size: ${fontSize};
    width: ${width};
    height: ${height};
    :hover:enabled {
        cursor: pointer;
    }
    :disabled {
        color: rgb(128, 128, 128);
    }
`;
const makeLegend = (align: Alignment, legend: string) => css`
    ${!window.matchMedia("(hover: none)").matches && legend
        ? `
            &::before {
                content: attr(data-legend);
                position: absolute;
                width: max-content;
                max-width: 10em;
                background-color: white;
                color: black;
                font-size: 0.85em;
                text-transform: none;
                padding: ${GLOBAL.padding};
                border-radius: ${GLOBAL.borderRadius};
                box-shadow: ${GLOBAL.insetShadow("black", 0.1)};
                white-space: wrap;
                text-align: left;
                transform: scale(0);
                transition: transform 0.25s 1s;
            }
            &:disabled:hover::before {
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
 * @param type - type of button, should be a member of ButtonVariants,
 * there should be .ts file describing style and default onClick behavior in Button folder,
 * it should be imported above buttonStyles object amended respectively
 * @param align - alignment of the button inside its container
 * @param width - width
 * @param height - height
 * @param background - background
 * @param color - text color
 * @param fontSize - font size
 * @param borderRadius - CSS border radius of the button, as text
 * @param legend - text to display when hovering over the button IFF it is disabled.
 * @param disabled - whether the button is disabled
 * @param level - minimum user level required to enable the button
 * @param toggleModal - whether the button should open or close a parent context modal
 * @param mute - whether the sound should be muted, e.g. when you need to play different sound separately
 * @param onClick - function to call when the button is clicked
 * @param children - child components to render as button innerHTML
 */
export type ButtonProps = ChildrenProps & {
    type?: ButtonVariants;
    align?: Alignment;
    width?: string;
    height?: string;
    background?: string;
    color?: string;
    fontSize?: string;
    borderRadius?: string;
    legend?: string;
    disabled?: boolean;
    level?: number;
    toggleModal?: ModalState;
    mute?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
const _Button = ({
    type = "whooshRotate",
    align = "left",
    width = "auto",
    height = "auto",
    background = "inherit",
    color = "inherit",
    fontSize = "inherit",
    borderRadius = "",
    legend = "",
    disabled = false,
    level = 0,
    toggleModal = "none",
    mute = false,
    onClick,
    children,
}: ButtonProps) => {
    const changeIsOpen = useModalUpdate();
    const user = useUser();
    const showLegend = user.legends;
    const animate = useAnimate();
    const volume = useSoundVolume();

    const container = useMemo(() => makeContainer(align), [align]);
    const emotion = useMemo(
        () => css`
            ${makeEmotion(
                width,
                height,
                borderRadius,
                background,
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
            background,
            color,
            fontSize,
            borderRadius,
            showLegend,
        ]
    );

    const flash = useMemo(() => buttonStyles[type].click, [type]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (toggleModal !== "none") changeIsOpen(toggleModal);
        flash(e.currentTarget, mute ? 0 : volume, animate);
        onClick && onClick(e);
    };

    return (
        <div css={container}>
            <button
                css={emotion}
                data-legend={legend}
                onClick={handleClick}
                disabled={disabled || user.level < level}
            >
                {children}
            </button>
        </div>
    );
};

const Button = React.memo(_Button);

export default Button;
