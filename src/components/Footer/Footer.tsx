import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";

// Emotion styles
const emotion = css`
    position: sticky;
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: ${GLOBAL.backgrounds.pink};
    border-radius: ${GLOBAL.borderRadius};
    box-shadow: ${GLOBAL.boxShadow};
    padding: ${GLOBAL.padding};
`;

const Footer = () => {
    return <div css={emotion}>Footer</div>;
};

export default Footer;
