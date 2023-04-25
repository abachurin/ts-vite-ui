import { css } from "@emotion/react";
import { GLOBAL } from "../../utils";
import { ChildrenProps } from "../../types";

interface NavProps extends ChildrenProps {
    textColor?: string;
}

/**
 * A React functional component that renders a navigation bar with the given
 * text color and children components.
 *
 * @param textColor - The color of the text in the navigation bar.
 * @param children - The child components to render within the navigation bar.
 */
const Nav = ({ textColor, children }: NavProps) => {
    const emotion = css`
        display: flex;
        align-items: center;
        gap: ${GLOBAL.padding};
        color: ${textColor};
    `;

    return <div css={emotion}>{children}</div>;
}
export default Nav;
