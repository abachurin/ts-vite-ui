import { css } from "@emotion/react";
import { ButtonExtraStyle, ButtonEffects } from "../../../types";
import { GLOBAL, makeSound } from "../../../utils/utils";
import clickSound from "../../../assets/sounds/mixkit-arrow-whoosh-1491.wav";

export const whooshRotateEmotion: ButtonExtraStyle = (borderRadius) => css`
    border: 0;
    border-radius: ${borderRadius || GLOBAL.borderRadius};
    &:hover:enabled {
        box-shadow: 0 0 0.2em white, 0 0 1em white;
    }
`;

export const whooshRotateClick: ButtonEffects = (
    button,
    volume,
    animate = true
) => {
    makeSound(clickSound, volume);
    animate &&
        button.animate(
            {
                transform: [
                    "rotateY(0deg)",
                    "rotateY(90deg)",
                    "rotateY(90deg)",
                    "rotateY(0deg)",
                ],
                offset: [0, 0.37, 0.63, 1],
            },
            300
        );
};
