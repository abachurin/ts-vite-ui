import { css } from "@emotion/react";
import clickSound from "../../../assets/sounds/mixkit-gate-latch-click-1924.wav";
import { ButtonExtraStyle, ButtonEffects } from "../../../types";
import { GLOBAL, makeSound } from "../../../utils";

export const clickPressEmotion: ButtonExtraStyle = (borderRadius) => css`
    border: 0;
    :hover:enabled {
        box-shadow: ${GLOBAL.insetShadow("white", 0.1)};
        opacity: 0.85;
    }
`;

export const clickPressClick: ButtonEffects = (
    button,
    volume,
    animate = true
) => {
    makeSound(clickSound, volume);
    animate &&
        button.animate(
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
};
