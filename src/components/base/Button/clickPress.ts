import { css } from "@emotion/react";
import clickSound from "../../../assets/sounds/mixkit-gate-latch-click-1924.wav";
import { OnClickFunction } from "../../../types";
import { GLOBAL } from "../../../utils";

export const clickPressEmotion = css`
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
