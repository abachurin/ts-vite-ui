import { css } from "@emotion/react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserProvider/UserContext";
import useDimensions from "../../hooks/useDimensions";
import { GLOBAL } from "../../utils";
import Star from "./Star";

// Emotion styles
const emotion = () => css`
    position: absolute;
    padding: 3em;
    height: 100%;
    width: 100%;
    background-color: ${GLOBAL.backgrounds.black};
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
        width > 600 ? GLOBAL.numOfStars.big : GLOBAL.numOfStars.small;
    return Array.from({ length: numberStars }, () =>
        Star({ inverseSpeed, width, height })
    );
};

/**
 * Renders a star field with a number of stars on the screen, which depends on window size.
 */
const StarField = () => {
    const [ref, width, height] = useDimensions();
    const user = useContext(UserContext);
    const inverseSpeed = user.animationInverseSpeed;

    const [stars, setStars] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setStars(createStarField(width, height, inverseSpeed));
    }, [width, height, inverseSpeed]);

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        return <div css={emotion} />;
    }

    return (
        <div ref={ref} css={emotion}>
            {stars}
        </div>
    );
};

export default StarField;
