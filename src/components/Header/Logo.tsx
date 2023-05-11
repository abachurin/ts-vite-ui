import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, SvgPaths, smoothScroll } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

/**
 * Renders a logo, works as a link to top of the page
 */

const Logo = () => {
    const palette = usePalette();
    const color = palette.logo;

    const emotion = useMemo(
        () => css`
            display: flex;
            gap: 0.1em;
            font-size: ${GLOBAL.logoScale}rem;
            color: ${color};
            transform: translateX(-0.2em);
        `,
        [color]
    );

    return (
        <Button align='left' onClick={() => smoothScroll("#agent-pane")}>
            <div css={emotion}>
                <Icon svg={SvgPaths.robot} />
                RL 2048
            </div>
        </Button>
    );
};

export default Logo;
