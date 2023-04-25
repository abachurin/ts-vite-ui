import { css } from "@emotion/react";
import { useCallback } from "react";
import Button from "../base/Button";
import Icon from "../base/Icon";
import { GLOBAL, smoothScroll } from "../../utils";

interface LogoProps {
    color: string;
}

/**
 * Renders a logo with a given color.
 *
 * @param color - The color of the logo.
 */
const Logo = ({ color }: LogoProps) => {
    const emotion = css`
        display: flex;
        align-items: center;
        gap: 0.1em;
        font-size: ${GLOBAL.logoScale}rem;
        color: ${color};
        transform: translateX(-0.2em);
    `;

    const onClick = useCallback(() => smoothScroll("#agent-pane"), []);

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
