import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { GLOBAL, setTransparency, smoothScroll } from "../../utils";

// Emotion styles
const makeEmotion = (backgroundColor: string, color: string) => css`
    position: sticky;
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: ${backgroundColor};
    color: ${color};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    padding: ${GLOBAL.padding};
`;

/**
 * Renders the footer component.
 * Scrolls to Game Pane when clicked (on small screen)
 */
const Footer = () => {
    const palette = usePalette();

    const emotion = useMemo(
        () =>
            makeEmotion(
                setTransparency(palette.header, palette.headerOpacity),
                palette.background
            ),
        [palette]
    );

    return (
        <div css={emotion} onClick={() => smoothScroll("#game-pane")}>
            &darr; Game Pane &darr;
        </div>
    );
};

export default Footer;
