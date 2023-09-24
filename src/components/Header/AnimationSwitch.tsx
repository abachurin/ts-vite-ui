import { useEffect } from "react";
import {
    useAnimate,
    useUserUpdate,
} from "../../contexts/UserProvider/UserContext";
import { SvgPaths } from "../../utils/utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

// Helper functions
type StyledHTMLElement = HTMLElement & {
    style: CSSStyleDeclaration;
};
const toggleMotion = (move: boolean): void => {
    const animations = document.querySelectorAll<StyledHTMLElement>(
        "[data-animated=true]"
    );
    animations.forEach((item) => {
        item.style.animationPlayState = move ? "running" : "paused";
    });
};

/**
 * Renders a button that toggles the animation setting of the User,
 * with Icon depending on animation state.
 */
const AnimationSwitch = () => {
    const animate = useAnimate();
    const updateUser = useUserUpdate();
    const icon = animate ? SvgPaths.yesMotion : SvgPaths.noMotion;

    useEffect(() => toggleMotion(animate), [animate]);

    const toggleAnimation = (): void => {
        const newAnimate = !animate;
        updateUser({ animate: newAnimate });
        toggleMotion(newAnimate);
    };

    return (
        <Button onClick={toggleAnimation}>
            <Icon svg={icon} />
        </Button>
    );
};

export default AnimationSwitch;
