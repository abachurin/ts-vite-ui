import { css, SerializedStyles } from "@emotion/react";
import clickSound from "../../../assets/sounds/mixkit-gate-latch-click-1924.wav";
import { Alignment, OnClickFunction } from "../../../types";
import { GLOBAL } from "../../../utils";

export const clickPressEmotion = (
    align: Alignment,
    legend: string
): SerializedStyles => css`
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

export const clickPressClick: OnClickFunction = (
    el: HTMLButtonElement,
    volume: number
) => {
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
    audio.volume = volume;
    audio.play();
};
