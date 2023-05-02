import { SerializedStyles, css } from "@emotion/react";
import React, {
    useRef,
    cloneElement,
    ReactNode,
    ReactElement,
    useMemo,
    useCallback,
} from "react";
import useToggle from "../../hooks/useToggle";
import { RGB, RGBA, ChildrenProps, Alignment } from "../../types";
import { GLOBAL, removeTransparency } from "../../utils";
import Button from "./Button/Button";
import Icon from "./Icon/Icon";

// Emotion styles
const makeEmotion = (
    align: Alignment,
    textColor: string
): SerializedStyles => css`
    display: flex;
    justify-content: ${align};
    align-items: center;
    color: ${textColor};
`;

const makeHidden = (
    backgroundColor: RGB | RGBA,
    align: Alignment,
    visibility: boolean
): SerializedStyles => css`
    position: fixed;
    top: 6rem;
    background-color: ${removeTransparency(backgroundColor)};
    border-radius: ${GLOBAL.borderRadius};
    padding: ${GLOBAL.padding};
    display: flex;
    flex-direction: column;
    gap: calc(${GLOBAL.padding} * 0.5);
    box-shadow: 0 0 0.5em 0.2em rgba(255, 255, 255, 0.2);
    transform: scale(${visibility ? 1 : 0});
    opacity: ${visibility ? 1 : 0};
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    ${align === "right"
        ? `right: calc(2 * ${GLOBAL.padding})`
        : `left: calc(2 * ${GLOBAL.padding})`};
`;

/**
 * Renders a vertical navigation bar with a toggle icon button and hidden menu.
 *
 * @param align - The alignment of the navigation component. Can be "left" or "right".
 * @param textColor - The color of the text in the navigation component.
 * @param logoColor - The color of the logo in the navigation component.
 * @param backgroundColor - The background color of the navigation component - in RGBA format!
 * @param children - The child components to render in the hidden menu.
 */
interface ToggleNavProps extends ChildrenProps {
    align?: Alignment;
    textColor?: string;
    logoColor?: string;
    backgroundColor: RGB | RGBA;
}
const ToggleNav = ({
    align = "left",
    textColor = "inherit",
    logoColor = "inherit",
    backgroundColor = "rgba(255, 255, 255, 1)",
    children,
}: ToggleNavProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visibility, setVisibility] = useToggle(false);

    const emotion = useMemo(
        () => makeEmotion(align, textColor),
        [align, textColor]
    );

    const hiddenNavStyle = useMemo(
        () => makeHidden(backgroundColor, align, visibility),
        [visibility, backgroundColor, align]
    );

    const renderChild = useCallback(
        (child: ReactNode): ReactNode => {
            return cloneElement(child as ReactElement, {
                align: align,
            });
        },
        [align]
    );

    return (
        <div css={emotion}>
            <Button onClick={() => setVisibility(!visibility)} align={align}>
                <Icon
                    color={logoColor}
                    svg={GLOBAL.svg.menu}
                    rescaleFactor={1.5}
                />
            </Button>
            <div ref={ref} css={hiddenNavStyle}>
                {React.Children.map(children, renderChild)}
            </div>
        </div>
    );
};

export default ToggleNav;
