import { css, keyframes } from "@emotion/react";
import { randomNum } from "../../utils";
import { uniqueId } from "lodash-es";

type StarProps = {
    inverseSpeed: number;
    width: number;
    height: number;
}

/**
 * Renders a star element that animates across the screen.
 *
 * @param inverseSpeed - The inverse speed of the animation, the lower - the faster.
 * @param width - The width of the screen in px.
 * @param height - The height of the screen in px.
 */
const Star = ({ inverseSpeed, width, height }: StarProps ) => {
    const x = randomNum(width);
    const y = randomNum(height);
    const x_start = x + "px";
    const y_start = y + "px";
    const depthOfPosition = 5;
    const x_delta = depthOfPosition * (2 * x - width) + "px";
    const y_delta = depthOfPosition * (2 * y - height) + "px";
    const size = (width > 600 ? 6 : 4) + "px";
    const color = `hsl(${randomNum(360)}, 100%, 85%)`;
    const delay = Math.random() * inverseSpeed+ "s";
    const animationParams = `${inverseSpeed}s cubic-bezier(0.8, 0, 1, 1) ${delay} infinite`;

    const fly = keyframes`
        from {
            border-width: 0px;
            transform: translateX(0) translateY(0);
        }

        to {
            border-width: ${size};
            transform: translateX(${x_delta}) translateY(${y_delta});
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

    const emotion = css`
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 1px;
        border-radius: 50%;
        left: ${x_start};
        top: ${y_start};
        border-color: ${color};
        animation: ${fly} ${animationParams}, ${fade} ${animationParams},
            ${fade} ${animationParams}, ${fade} ${animationParams};
    `;

    return <div key={uniqueId()} data-animated='true' css={emotion}></div>;
};

export default Star;
