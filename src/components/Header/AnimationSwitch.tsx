import { useContext } from "react";
import { GLOBAL } from "../../utils";
import {
    UserContext,
    UserUpdateContext,
} from "../../contexts/UserProvider/UserContext";
import Button from "../base/Button";
import Icon from "../base/Icon";
import { StyledHTMLElement } from "../../types";

/**
 * Renders a button that toggles the animation setting of the User,
 * with Icon depending on animation state.
 */
const AnimationSwitch = () => {
    const user = useContext(UserContext);
    const updateUser = useContext(UserUpdateContext);
    const icon = user.animate ? GLOBAL.svg.yesMotion : GLOBAL.svg.noMotion;

    const toggleMotion = (move: boolean): void => {
        const animations = document.querySelectorAll<StyledHTMLElement>(
            "[data-animated=true]"
        );
        animations.forEach((item) => {
            item.style.animationPlayState = move ? "running" : "paused";
        });
    };

    toggleMotion(user.animate);

    const toggleAnimation = (): void => {
        const newAnimate = !user.animate;
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
