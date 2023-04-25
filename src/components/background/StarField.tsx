import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import useDimensions from "../../hooks/useDimensions";
import { useUser } from "../../contexts/UserContext";
import Star from "./Star";
import { GLOBAL } from "../../utils";

/**
 * Renders a star field with a number of stars on the screen, which depends on window size.
 */
const StarField = () => {
    const {ref, width, height} = useDimensions();
    const user = useUser();
    const inverseSpeed = user.animationInverseSpeed;

    const [stars, setStars] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const numberStars = width > 600 ? GLOBAL.numOfStars.big : GLOBAL.numOfStars.small;
        const starArray = Array.from({ length: numberStars }, () => {
            return Star({ inverseSpeed, width, height });
        });
        setStars(starArray);
    }, [inverseSpeed, width, height]);
 
    const emotion = css`
        position: absolute;
        padding: 3em;
        height: 100%;
        width: 100%;
        background-color: ${GLOBAL.backgrounds.black};
        overflow: hidden;
        z-index: -1;
    `;

    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        return <div css={emotion}/>
    }

    return (
        <div ref={ref} css={emotion}>
            {stars}
        </div>
    );
};

export default StarField;
