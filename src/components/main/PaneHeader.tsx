import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps, RGBA, RGB } from "../../types";
import { GLOBAL, setTransparency, smoothScroll } from "../../utils";

// Emotion styles
const makeEmotion = (
    backgroundColor: RGBA,
    descriptionColor: RGB,
    color: string
): SerializedStyles => css`
    display: flex;
    justify-content: space-between;
    background-color: ${backgroundColor};
    color: ${color};
    padding-inline: calc(${GLOBAL.padding} * 2);
    padding-block: ${GLOBAL.padding};
    font-size: 0.85rem;
    & > nav {
        display: flex;
        justify-content: center;
        gap: ${GLOBAL.padding};
    }
    & > aside {
        display: flex;
        align-items: center;
        padding-inline: calc(${GLOBAL.padding} * 2);
        border-radius: ${GLOBAL.borderRadius};
        background-color: ${color};
        color: ${descriptionColor};
        gap: ${GLOBAL.padding};
    }
`;

/**
 * A React component that renders a flexible pane.
 * @param props - The props object with optional properties and children.
 */
interface PaneHeaderProps extends ChildrenProps {
    type: "agent" | "game";
    text: string;
}
const PaneHeader = ({ type, text, children }: PaneHeaderProps) => {
    const palette = usePalette();
    const backgroundColor = setTransparency(
        type === "agent" ? palette.one : palette.two,
        2 * palette.paneOpacity
    );

    const emotion = useMemo(
        () => makeEmotion(backgroundColor, palette.text, palette.background),
        [palette]
    );

    return (
        <header css={emotion} onClick={() => smoothScroll(`#${type}-pane`)}>
            <nav>{children}</nav>
            <aside>{text}</aside>
        </header>
    );
};

export default PaneHeader;
