import { css } from "@emotion/react";
import { useMemo } from "react";
import { useUser } from "../../contexts/UserProvider/UserContext";
import useDimensions from "../../hooks/useDimensions";
import { GLOBAL } from "../../utils";
import Star from "./Star";

// Emotion styles
const emotion = () => css`
    position: absolute;
    padding: 3em;
    height: 100%;
    width: 100%;
    background-color: black;
    overflow: hidden;
    z-index: -1;
`;

/**
 * Creates an array of JSX Elements representing a star field.
 * @param {number} width - The width of the star field.
 * @param {number} height - The height of the star field.
 * @param {number} inverseSpeed - The inverse speed of the stars.
 */
const createStarField = (
    width: number,
    height: number,
    inverseSpeed: number
): JSX.Element[] => {
    const numberStars =
        // Need to rewrite this with canvas, doesn't work nicely on mobiles in the current state
        width > 600 ? GLOBAL.numOfStars.big : 0;
    return Array.from({ length: numberStars }, () =>
        Star({ inverseSpeed, width, height })
    );
};

/**
 * Renders a star field with a number of stars on the screen which depends on window size.
 */
const StarField = () => {
    const [ref, width, height] = useDimensions();
    const user = useUser();
    const inverseSpeed = 20 / user.animationSpeed;

    const stars = useMemo(
        () => createStarField(width, height, inverseSpeed),
        [width, height, inverseSpeed]
    );

    return (
        <div ref={ref} css={emotion}>
            {stars}
        </div>
    );
};

export default StarField;
