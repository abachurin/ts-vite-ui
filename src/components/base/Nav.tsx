import { css, SerializedStyles } from "@emotion/react";
import { ChildrenProps } from "../../types";
import { GLOBAL } from "../../utils";

// Emotion styles
const makeEmotion = (textColor: string): SerializedStyles => css`
    display: flex;
    align-items: center;
    gap: ${GLOBAL.padding};
    color: ${textColor};
`;

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
const Nav = ({ textColor = "inherit", children }: NavProps) => {
    const emotion = makeEmotion(textColor);

    return <div css={emotion}>{children}</div>;
};
export default Nav;
