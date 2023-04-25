import { css } from "@emotion/react";
import React, { useRef, cloneElement, ReactNode, ReactElement, useMemo, useCallback } from "react";
import Button from "./Button";
import Icon from "./Icon";
import { GLOBAL, rgba_rgb } from "../../utils";
import { RgbaColor, ChildrenProps, Alignment } from "../../types";
import useToggle from "../../hooks/useToggle";

interface NavProps extends ChildrenProps {
    align?: Alignment;
    textColor?: string;
    logoColor?: string;
    backgroundColor: RgbaColor;
}

/**
 * Renders a vertical navigation bar with a toggle icon button and hidden menu.
 * 
 * @param align - The alignment of the navigation component. Can be "left" or "right".
 * @param textColor - The color of the text in the navigation component.
 * @param logoColor - The color of the logo in the navigation component.
 * @param backgroundColor - The background color of the navigation component - in RGBA format!
 * @param children - The child components to render in the hidden menu.
 */
const ToggleNav = ({ align, textColor, logoColor, backgroundColor, children }: NavProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visibility, setVisibility] = useToggle(false);

    const emotion = useMemo(() => css`
        display: flex;
        justify-content: ${align};
        align-items: center;
        color: ${textColor};
    `, [align, textColor]
    );

    const fullColor = rgba_rgb(backgroundColor);
    console.log(backgroundColor, fullColor);

    const hiddenNavStyle = useMemo(() => css`
        position: fixed;
        top: 6rem;
        background-color: ${fullColor};
        border-radius: ${GLOBAL.borderRadius};
        padding: ${GLOBAL.padding};
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 0.5em 0.2em rgba(255, 255, 255, 0.2);
        transform: scale(${visibility ? 1 : 0});
        opacity: ${visibility ? 1 : 0};
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        ${align === "right" ? `right: calc(2 * ${GLOBAL.padding})` : `left: calc(2 * ${GLOBAL.padding})`};
    `, [visibility, fullColor, align]
    );

    const renderChild = useCallback((child: ReactNode) => {
        return cloneElement(child as ReactElement, {
            align: align
        });
    }, [align]);


    return (
        <div css={emotion}>
            <Button
                onClick={() => setVisibility(!visibility)}
                align={align}
            >
                <Icon color={logoColor} svg={GLOBAL.svg.menu} baseScale={1} />
            </Button>
            <div ref={ref} css={hiddenNavStyle}>
                {React.Children.map(children, renderChild)}
            </div>
        </div>
    );
}

export default ToggleNav;
