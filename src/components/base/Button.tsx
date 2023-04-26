import { css, SerializedStyles } from "@emotion/react";
import { useMemo, useContext } from "react";
import clickSound from "../../assets/sounds/mixkit-arrow-whoosh-1491.wav";
import { UserContext } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps, Alignment } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeContainer = (align: Alignment): SerializedStyles => css`
    display: flex;
    justify-content: ${align};
    align-items: center;
`;

const makeEmotion = (align: Alignment, legend: string): SerializedStyles => css`
    position: relative;
    text-decoration: none;
    padding: ${GLOBAL.padding};
    background-color: inherit;
    color: inherit;
    font-size: inherit;
    border: 0;
    border-radius: ${GLOBAL.borderRadius};
    &:hover:enabled {
        cursor: pointer;
        box-shadow: 0 0 0.2em var(--white), 0 0 1em var(--white),
            0 0 2em var(--white), 0 0 4em var(--white);
    }
    &:disabled {
        opacity: 0.75;
    }
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
 * @param align - The alignment of the button.
 * @param legend - The text to display when hovering over the button if it is disabled.
 * @param level - The minimum user level required to click the button.
 * @param onClick - The function to call when the button is clicked.
 * @param children - The child components to render within the button.
 * @param closingModal - Set "true" if the button is inside a modal and should close it when clicked.
 */
export interface ButtonProps extends ChildrenProps {
    align?: Alignment;
    legend?: string;
    level?: number;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    alsoCloseModal?: boolean;
}
const Button = ({
    align = "left",
    legend = "",
    level = 0,
    onClick,
    children,
}: ButtonProps) => {
    const user = useContext(UserContext);

    const flashLink = (el: HTMLButtonElement) => {
        el.animate(
            {
                transform: [
                    "rotateY(0deg)",
                    "rotateY(90deg)",
                    "rotateY(90deg)",
                    "rotateY(0deg)",
                ],
                offset: [0, 0.37, 0.63, 1],
            },
            1000
        );
        const audio = new Audio(clickSound);
        audio.volume = user.sound ? user.soundLevel : 0;
        audio.play();
    };

    const container = useMemo(() => makeContainer(align), [align]);
    const emotion = useMemo(() => makeEmotion(align, legend), [align, legend]);

    return (
        <div css={container}>
            <button
                css={emotion}
                data-legend={legend}
                onClick={(e) => {
                    flashLink(e.currentTarget as HTMLButtonElement);
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
