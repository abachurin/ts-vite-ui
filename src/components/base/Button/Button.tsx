import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useContext } from "react";
import { UserContext } from "../../../contexts/UserProvider/UserContext";
import { ChildrenProps, Alignment, ButtonVariants } from "../../../types";
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

const makeLegend = (align: Alignment, legend: string): SerializedStyles => css`
    ${!window.matchMedia("(hover: none)").matches && legend
        ? `
            &::before {
                position: absolute;
                width: 10em;
                background-color: ${GLOBAL.backgrounds.pearl};
                color: rgba(0, 0, 0, 1);
                font-size: 0.7em;
                padding: ${GLOBAL.padding};
                content: attr(data-legend);
                white-space: wrap;
                text-align: left;
                transform: scale(0);
                transition: transform 0.25s;
                z-index: 2;
            }
            &:hover:disabled::before {
                transform: scale(1);
            }
            ${
                align === "right"
                    ? `
                        &:before {
                            top: 2em;
                            right: 100%;
                        }
                    `
                    : `
                        &:before {
                            top: 100%;
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
 * @param legend - The text to display when hovering over the button if it is disabled.
 * @param level - The minimum user level required to click the button.
 * @param onClick - The function to call when the button is clicked.
 * @param children - The child components to render within the button.
 * @param aldoCloseModal - Set "true" if the button is inside a modal and should close it
 * when clicked. Note, that this prop is actually used by the parent ModalWindow component,
 * but has to be declared here
 */
export interface ButtonProps extends ChildrenProps {
    type?: ButtonVariants;
    align?: Alignment;
    legend?: string;
    level?: number;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    alsoCloseModal?: boolean;
}
const Button = ({
    type = "whooshRotate",
    align = "left",
    legend = "",
    level = 0,
    onClick,
    children,
}: ButtonProps) => {
    const user = useContext(UserContext);
    const volume = user.sound ? user.soundLevel : 0;

    const container = useMemo(() => makeContainer(align), [align]);
    const emotion = useMemo(
        () => css`
            ${buttonStyles[type].style(align, legend)},
            ${makeLegend(align, legend)}
        `,
        [type, align, legend]
    );
    const flash = useMemo(() => buttonStyles[type].click, [type]);

    return (
        <div css={container}>
            <button
                css={emotion}
                data-legend={legend}
                onClick={(e) => {
                    flash(e.currentTarget as HTMLButtonElement, volume);
                    onClick && onClick(e);
                }}
                disabled={user.level < level}
            >
                {children}
            </button>
        </div>
    );
};

export default Button;
