import { css, keyframes, Keyframes } from "@emotion/react";
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
`;
const makeEmotion = (
    x: number,
    y: number,
    color: string,
    flyAnimation: Keyframes,
    animationParams: string
) => css`
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 1px;
    border-radius: 50%;
    left: ${x}px;
    top: ${y}px;
    border-color: ${color};
    animation: ${flyAnimation} ${animationParams}, ${fade} ${animationParams};
`;

/**
 * Renders a star element for StarField component.
 * @param inverseSpeed - inverse speed of the animation, the lower - the faster
 * @param width - width of the screen in px
 * @param height - height of the screen in px
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
    const xDelta = GLOBAL.depthOfStarField * (2 * x - width);
    const yDelta = GLOBAL.depthOfStarField * (2 * y - height);
    const size = Math.round(randomNum(1, 0.5) * (width > 600 ? 6 : 4));
    const animationParams = `${inverseSpeed}s cubic-bezier(0.8, 0, 1, 1) ${delay}s infinite`;
    const flyAnimation = fly(size, xDelta, yDelta);

    const emotion = makeEmotion(x, y, color, flyAnimation, animationParams);

    return <li key={uniqueId()} data-animated='true' css={emotion}></li>;
};

export default Star;
