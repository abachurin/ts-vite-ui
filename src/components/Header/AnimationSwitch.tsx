import {
    useUser,
    useUserUpdate,
} from "../../contexts/UserProvider/UserContext";
import { StyledHTMLElement } from "../../types";
import { SvgPaths } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

// Helper functions
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
    const user = useUser();
    const updateUser = useUserUpdate();
    const icon = user.animate ? SvgPaths.yesMotion : SvgPaths.noMotion;

    Promise.resolve().then(() => toggleMotion(user.animate));

    const toggleAnimation = (): void => {
        const newAnimate = !user.animate;
        updateUser({ animate: newAnimate });
        Promise.resolve().then(() => toggleMotion(user.animate));
    };

    return (
        <Button onClick={toggleAnimation}>
            <Icon svg={icon} />
        </Button>
    );
};

export default AnimationSwitch;
