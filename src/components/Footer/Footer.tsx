import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";

const Footer = () => {
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

    return <div css={emotion}>Footer</div>;
};

export default Footer;
