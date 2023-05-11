import { css } from "@emotion/react";
import clickSound from "../../../assets/sounds/mixkit-gate-latch-click-1924.wav";
import { ButtonExtraStyle, ButtonSound } from "../../../types";
import { GLOBAL, makeSound } from "../../../utils";

export const clickPressEmotion: ButtonExtraStyle = (borderRadius) => css`
    border: 0;
    :hover:enabled {
        cursor: pointer;
    }
    :hover:enabled::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: ${borderRadius || GLOBAL.borderRadius};
        background-color: rgba(255, 255, 255, 0.1);
    }
    :disabled {
        opacity: 0.7;
    }
`;

export const clickPressClick: ButtonSound = (el, volume) => {
    el.animate(
        {
            transform: [
                "translateX(0) translateY(0)",
                "translateX(0.2rem) translateY(-0.2rem)",
                "translateX(0) translateY(0)",
            ],
            opacity: [1, 0.7, 1],

            offset: [0, 0.5, 1],
        },
        300
    );
    makeSound(clickSound, volume);
};
