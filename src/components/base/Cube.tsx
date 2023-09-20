import { css, keyframes } from "@emotion/react";
import { useMemo } from "react";

// Emotion styles
const makeContainer = (size: number) => css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${size}rem;
    height: ${size}rem;
    perspective: ${5 * size}rem;
    z-index: 100;
`;
const rotate = keyframes`
    0% { transform: rotateX(0deg) rotateY(360deg) rotateZ(90deg); }
    25% { transform: rotateX(90deg) rotateY(270deg) rotateZ(180deg); }
    50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(0deg); }
    75% { transform: rotateX(270deg) rotateY(90deg) rotateZ(360deg); }
    100% { transform: rotateX(360deg) rotateY(0deg) rotateZ(270deg); }
`;
const makeEmotion = (size: number) => css`
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: ${rotate} 10s infinite;
    & > li {
        width: ${size}rem;
        height: ${size}rem;
        display: block;
        position: absolute;
    }
    & > li:nth-of-type(1) {
        transform: rotateX(0deg) translateZ(${size / 2}rem);
        background-color: rgba(255, 0, 0, 0.25);
    }
    & > li:nth-of-type(2) {
        transform: rotateX(180deg) translateZ(${size / 2}rem);
        background-color: rgba(0, 255, 0, 0.25);
    }
    & > li:nth-of-type(3) {
        transform: rotateY(90deg) translateZ(${size / 2}rem);
        background-color: rgba(0, 0, 255, 0.25);
    }
    & > li:nth-of-type(4) {
        transform: rotateY(-90deg) translateZ(${size / 2}rem);
        background-color: rgba(255, 255, 0.25);
    }
    & > li:nth-of-type(5) {
        transform: rotateX(90deg) translateZ(${size / 2}rem);
        background-color: rgba(255, 0, 255, 0.25);
    }
    & > li:nth-of-type(6) {
        transform: rotateX(-90deg) translateZ(${size / 2}rem);
        background-color: rgba(255, 255, 0, 0.25);
    }
`;

type CubeProps = {
    size?: number;
};
/**
 * Renders a rotating cube of specified size.
 * @param size - size of the cube in rem
 */
const Cube = ({ size = 6 }: CubeProps) => {
    const container = useMemo(() => makeContainer(size), [size]);
    const emotion = useMemo(() => makeEmotion(size), [size]);

    return (
        <div css={container}>
            <ul css={emotion}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <li key={item} />
                ))}
            </ul>
        </div>
    );
};

export default Cube;
