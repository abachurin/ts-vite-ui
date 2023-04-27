import { css, SerializedStyles } from "@emotion/react";
import { useCallback } from "react";
import { GLOBAL, smoothScroll } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon";

// Emotion styles
const makeEmotion = (color: string): SerializedStyles => css`
    display: flex;
    align-items: center;
    gap: 0.1em;
    font-size: ${GLOBAL.logoScale}rem;
    color: ${color};
    transform: translateX(-0.2em);
`;

/**
 * Renders a logo with a given color.
 * @param color - The color of the logo.
 */
type LogoProps = {
    color: string;
};
const Logo = ({ color }: LogoProps) => {
    const emotion = makeEmotion(color);
    const onClick = useCallback((): void => smoothScroll("#agent-pane"), []);

    return (
        <Button onClick={onClick}>
            <div css={emotion}>
                <Icon svg={GLOBAL.svg.robot} />
                RL 2048
            </div>
        </Button>
    );
};

export default Logo;
