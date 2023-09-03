import { css } from "@emotion/react";
import { useMemo } from "react";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import { ChildrenProps } from "../../types";
import { GLOBAL, setTransparency, smoothScroll } from "../../utils";

// Emotion styles
const makeEmotion = (
    backgroundColor: string,
    descriptionColor: string,
    color: string
) => css`
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
 * Pane header.
 * @param type - "agent" or "game" pane
 * @param text - text describing current action
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
