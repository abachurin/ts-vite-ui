import { css } from "@emotion/react";
import clickSound from "../../../assets/sounds/mixkit-arrow-whoosh-1491.wav";
import { OnClickFunction } from "../../../types";
import { GLOBAL, makeSound } from "../../../utils";

export const whooshRotateEmotion = (borderRadius: string) => css`
    border: 0;
    border-radius: ${borderRadius || GLOBAL.borderRadius};
    &:hover:enabled {
        cursor: pointer;
        box-shadow: 0 0 0.2em white, 0 0 1em white;
    }
    :disabled {
        opacity: 0.75;
    }
`;

export const whooshRotateClick: OnClickFunction = (
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
    makeSound(clickSound, volume);
};
