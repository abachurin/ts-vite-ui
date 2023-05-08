import { css, keyframes, SerializedStyles, Keyframes } from "@emotion/react";
import { uniqueId } from "lodash-es";
import { GLOBAL, randomNum } from "../../utils";

// Emotion styles
const fly = (size: number, x_delta: number, y_delta: number) => keyframes`
    from {
        border-width: 0px;
        transform: translateX(0) translateY(0);
    }

    to {
        border-width: ${size}px;
        transform: translateX(${x_delta}px) translateY(${y_delta}px);
    }
    `;

const fade = keyframes`
    0%, 90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
    // `;

const makeEmotion = (
    x: number,
    y: number,
    color: string,
    flyAnimation: Keyframes,
    fadeAnimation: Keyframes,
    animationParams: string
): SerializedStyles => css`
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 1px;
    border-radius: 50%;
    left: ${x}px;
    top: ${y}px;
    border-color: ${color};
    animation: ${flyAnimation} ${animationParams},
        ${fadeAnimation} ${animationParams}, ${fade} ${animationParams},
        ${fade} ${animationParams};
`;

/**
 * Renders a star element that animates across the screen.
 * @param inverseSpeed - The inverse speed of the animation, the lower - the faster.
 * @param width - The width of the screen in px.
 * @param height - The height of the screen in px.
 */
type StarProps = {
    inverseSpeed: number;
    width: number;
    height: number;
};
const Star = ({ inverseSpeed, width, height }: StarProps) => {
    const x = randomNum(width);
    const y = randomNum(height);
    const color = `hsl(${randomNum(360)}, 100%, 85%)`;
    const delay = Math.random() * inverseSpeed;
    const x_delta = GLOBAL.depthOfStarField * (2 * x - width);
    const y_delta = GLOBAL.depthOfStarField * (2 * y - height);
    const size = width > 600 ? 6 : 4;
    const animationParams = `${inverseSpeed}s cubic-bezier(0.8, 0, 1, 1) ${delay}s infinite`;
    const flyAnimation = fly(size, x_delta, y_delta);

    const emotion = makeEmotion(
        x,
        y,
        color,
        flyAnimation,
        fade,
        animationParams
    );

    return <div key={uniqueId()} data-animated='true' css={emotion}></div>;
};

export default Star;
