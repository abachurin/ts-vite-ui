import { css } from "@emotion/react";
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
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(
        navigator.userAgent
    );
}

/**
 * Renders a star field with a number of stars on the screen which depends on window size.
 * Works weirdly on mobile, so switched off there.
 * Need to rewrite this with "canvas"
 */
const StarField = () => {
    const { width, height, ref } = useDimensions();
    const user = useUser();

    const inverseSpeed = 20 / user.animationSpeed;
    const numberStars = Math.floor((width * height) / GLOBAL.oneStarPixels);

    return (
        <div ref={ref} css={emotion}>
            {isMobileDevice()
                ? null
                : Array.from({ length: numberStars }, () =>
                      Star({ inverseSpeed, width, height })
                  )}
        </div>
    );
};

export default StarField;
