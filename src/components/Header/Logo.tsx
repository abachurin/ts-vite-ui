import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, SvgPaths, smoothScroll } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

// Emotion styles
const makeEmotion = (logoColor: string) => css`
    display: flex;
    gap: 0.1em;
    font-size: ${GLOBAL.logoScale}rem;
    color: ${logoColor};
    transform: translateX(-0.2em);
`;

/**
 * Logo, scrolls to Agent Pane when clicked
 */

const Logo = () => {
    const palette = usePalette();

    const emotion = useMemo(() => makeEmotion(palette.logo), [palette.logo]);

    return (
        <Button
            align='left'
            mute={true}
            onClick={() => smoothScroll("#agent-pane")}
        >
            <div css={emotion}>
                <Icon svg={SvgPaths.robot} />
                RL 2048
            </div>
        </Button>
    );
};

export default Logo;
