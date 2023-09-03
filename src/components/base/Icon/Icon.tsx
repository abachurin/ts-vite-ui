import { css } from "@emotion/react";
import { ReactNode } from "react";
import useFontScale from "../../../hooks/useFontScale";

// Emotion styles
const makeEmotion = (
    initialSize: number,
    scale: number,
    rescaleFactor: number
) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(initialSize * rescaleFactor) / 16}rem;
    aspect-ratio: 1;
    & > main {
        display: grid;
        place-items: center;
        transform: scale(${(scale * rescaleFactor) / 1.5});
    }
`;

/**
 * Renders an SVG icon with optional color, size, and offset.
 * @param initialSize base size of the icon in pixels
 * @param rescaleFactor scale factor to obtain the desired size at default rem = 16px
 * @param color color of the icon.
 * @param svg SVG path data for the icon or a suitable React node
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

    const emotion = makeEmotion(initialSize, scale, rescaleFactor);

    const svgElement =
        typeof svg === "string" ? (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='currentColor'
            >
                <path fill={color} d={svg}></path>
            </svg>
        ) : (
            svg
        );

    return (
        <div css={emotion}>
            <main>{svgElement}</main>
        </div>
    );
};

export default Icon;
