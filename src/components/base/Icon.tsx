import { css, SerializedStyles } from "@emotion/react";
import useFontScale from "../../hooks/useFontScale";

// Emotion styles
const makeEmotion = (scale: number, baseScale: number): SerializedStyles => css`
    display: grid;
    place-items: center;
    transform: scale(${(scale * baseScale) / 1.5});
`;

/**
 * Renders an SVG icon with optional color, size, and offset.
 *
 * @param baseScale The base size of the icon in em units.
 * @param offset The vertical offset of the icon in pixels.
 * @param color The color of the icon.
 * @param svg The SVG path data for the icon.
 */
type IconProps = {
    baseScale?: number;
    color?: string;
    svg: string;
};
const Icon = ({ baseScale = 1, color = "inherit", svg }: IconProps) => {
    const scale = useFontScale();

    const emotion = makeEmotion(scale, baseScale);

    return (
        <div css={emotion}>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='currentColor'
            >
                <path fill={color} d={svg}></path>
            </svg>
        </div>
    );
};

export default Icon;
