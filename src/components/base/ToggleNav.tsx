import { css } from "@emotion/react";
import React, {
    cloneElement,
    ReactNode,
    ReactElement,
    useMemo,
    useState,
    useCallback,
    useEffect,
} from "react";
import { RGB, RGBA, ChildrenProps, Alignment } from "../../types";
import { GLOBAL, SvgPaths, removeTransparency } from "../../utils";
import Button from "./Button/Button";
import Icon from "./Icon/Icon";

// Emotion styles
const makeEmotion = (align: Alignment, textColor: string) => css`
    display: flex;
    justify-content: ${align};
    align-items: center;
    color: ${textColor};
`;

const makeHidden = (
    backgroundColor: RGB | RGBA,
    align: Alignment,
    visibility: boolean
) => css`
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
    transition: opacity 0.3s ease-in-out, transform 0.5s ease-in-out;
    ${align === "right"
        ? `right: calc(2 * ${GLOBAL.padding})`
        : `left: calc(2 * ${GLOBAL.padding})`};
`;

/**
 * Vertical hidden navigation bar with a toggle icon button
 * @param align - alignment of the navigation component, "left" or "right"
 * @param textColor - text color
 * @param logoColor - logo color
 * @param backgroundColor - background color in RGB / RGBA format
 * @param children - child components to render in the navigation
 */
type ToggleNavProps = ChildrenProps & {
    align?: Alignment;
    textColor?: string;
    logoColor?: string;
    backgroundColor: RGB | RGBA;
};
const ToggleNav = ({
    align = "left",
    textColor = "inherit",
    logoColor = "inherit",
    backgroundColor = "rgba(255, 255, 255, 1)",
    children,
}: ToggleNavProps) => {
    const [visibility, setVisibility] = useState(false);

    const closeNav = () => setVisibility(false);

    useEffect(() => {
        document.addEventListener("mousedown", closeNav);
        return () => {
            document.removeEventListener("mousedown", closeNav);
        };
    }, []);

    const toggleVisibility = () =>
        setVisibility((prevVisibility) => !prevVisibility);

    const emotion = useMemo(
        () => makeEmotion(align, textColor),
        [align, textColor]
    );

    const hiddenNavStyle = useMemo(
        () => makeHidden(backgroundColor, align, visibility),
        [backgroundColor, align, visibility]
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
            <Button onClick={toggleVisibility} align={align}>
                <Icon
                    color={logoColor}
                    svg={SvgPaths.menu}
                    rescaleFactor={1.5}
                />
            </Button>
            <main css={hiddenNavStyle}>
                {React.Children.map(children, renderChild)}
            </main>
        </div>
    );
};

export default ToggleNav;
