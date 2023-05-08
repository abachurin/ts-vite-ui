import { css } from "@emotion/react";
import { useMemo } from "react";
import { useUser } from "../../contexts/UserProvider/UserContext";
import { palettes } from "../../contexts/UserProvider/palette";
import { RGBA, RGB } from "../../types";
import { GLOBAL, setTransparency } from "../../utils";

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
    const user = useUser();
    const palette = palettes[user.paletteName];

    const emotion = useMemo(
        () =>
            makeEmotion(
                setTransparency(palette.header, palette.headerOpacity),
                palette.background
            ),
        [palette]
    );

    return <div css={emotion}>Footer</div>;
};

export default Footer;
