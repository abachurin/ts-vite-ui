import { css } from "@emotion/react";
import { ButtonExtraStyle, ButtonEffects } from "../../../types";
import { GLOBAL, makeSound } from "../../../utils/utils";
import clickSound from "../../../assets/sounds/mixkit-gate-latch-click-1924.wav";

export const clickPressEmotion: ButtonExtraStyle = () => css`
    border: 0;
    :hover:enabled {
        box-shadow: ${GLOBAL.middleShadow};
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
