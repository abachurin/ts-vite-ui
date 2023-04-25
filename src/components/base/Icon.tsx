import { css } from "@emotion/react";
import useFontScale from "../../hooks/useFontScale";

interface IconProps {
    baseScale?: number;
    offset?: number;
    color?: string;
    svg: string;
}

/**
 * Renders an SVG icon with optional color, size, and offset.
 *
 * @param baseScale The base size of the icon in em units.
 * @param offset The vertical offset of the icon in pixels.
 * @param color The color of the icon.
 * @param svg The SVG path data for the icon.
 */
const Icon = ({ baseScale=1.5, offset=0, color="inherit", svg }: IconProps) => {
    const scale = useFontScale();

    const emotion = css`
        display: grid;
        place-items: center;
        font-size: ${baseScale}em;
        transform: scale(${scale / (baseScale)})
            translateY(${offset});
    `;

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
}

export default Icon;
