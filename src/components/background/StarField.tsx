import { css } from "@emotion/react";
import { useMemo } from "react";
import { useInverseAnimationSpeed } from "../../contexts/UserProvider/UserContext";
import useDimensions from "../../hooks/useDimensions";
import { GLOBAL } from "../../utils";
import Star from "./Star";

// Emotion styles
const emotion = css`
    position: absolute;
    padding: 3em;
    height: 100%;
    width: 100%;
    background-color: black;
    overflow: hidden;
    z-index: -1;
`;

// Helper functions
const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(
        navigator.userAgent
    );
};
const createStars = (
    numStars: number,
    inverseSpeed: number,
    width: number,
    height: number
): JSX.Element[] => {
    return Array.from({ length: numStars }, () =>
        Star({ inverseSpeed, width, height })
    );
};

/**
 * Renders a star field with a number of stars on the screen which depends on window size,
 * Works weirdly on mobile, so switched off there,
 * Need to rewrite this with HTML Canvas
 */
const StarField = () => {
    const { width, height } = useDimensions();
    const inverseSpeed = useInverseAnimationSpeed();

    const numStars = Math.floor((width * height) / GLOBAL.oneStarPixels);

    const starArray = useMemo(() => {
        if (isMobileDevice()) {
            return null;
        } else {
            return createStars(numStars, inverseSpeed, width, height);
        }
    }, [numStars, inverseSpeed, width, height]);

    return <div css={emotion}>{starArray}</div>;
};

export default StarField;
