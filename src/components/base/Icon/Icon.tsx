import { css, SerializedStyles } from "@emotion/react";
import { ReactNode } from "react";
import useFontScale from "../../../hooks/useFontScale";

// Emotion styles
const makeWrapper = (
    initialSize: number,
    rescaleFactor: number
): SerializedStyles => css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(initialSize * rescaleFactor) / 16}rem;
    aspect-ratio: 1;
`;
const makeEmotion = (
    scale: number,
    rescaleFactor: number
): SerializedStyles => css`
    display: grid;
    place-items: center;
    transform: scale(${(scale * rescaleFactor) / 1.5});
`;

/**
 * Renders an SVG icon with optional color, size, and offset.
 *
 * @param initialSize The base size of the icon in pixels.
 * @param rescaleFactor The scale factor to obtain the desired size at default rem = 16px.
 * @param color The color of the icon.
 * @param svg The SVG path data for the icon.
 */
type IconProps = {
    initialSize?: number;
    rescaleFactor?: number;
    color?: string;
    svg: string | ReactNode;
};
const Icon = ({
    initialSize = 24,
    rescaleFactor = 1,
    color = "inherit",
    svg,
}: IconProps) => {
    const scale = useFontScale();

    const wrapper = makeWrapper(initialSize, rescaleFactor);
    const emotion = makeEmotion(scale, rescaleFactor);

    return typeof svg === "string" ? (
        <div css={wrapper}>
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
        </div>
    ) : (
        <div css={wrapper}>
            <div css={emotion}>{svg}</div>
        </div>
    );
};

export default Icon;
