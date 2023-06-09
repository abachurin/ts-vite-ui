import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { RGBA, RGB } from "../../types";
import { GLOBAL, setTransparency, smoothScroll } from "../../utils";

// Emotion styles
const makeEmotion = (backgroundColor: RGB | RGBA, color: RGB) => css`
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
            Footer
        </div>
    );
};

export default Footer;
