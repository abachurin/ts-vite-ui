import { GLOBAL } from "../../utils";
import { useUser, useUpdateUser } from "../../contexts/UserContext";
import Button from "../base/Button";
import Icon from "../base/Icon";
import { StyledHTMLElement } from "../../types";

/**
* Renders a button that toggles the animation setting of the User,
* with Icon depending on animation state.
*/
const AnimationSwitch = () => {
    const user = useUser();
    const updateUser = useUpdateUser();
    const icon = user.animate ? GLOBAL.svg.yesMotion : GLOBAL.svg.noMotion;

    const toggleMotion = (move: boolean) => {
        const animations = document.querySelectorAll<StyledHTMLElement>("[data-animated=true]");
        animations.forEach((item) => {
            item.style.animationPlayState = move ? "running" : "paused";
        });
    };

    toggleMotion(user.animate);

    const toggleAnimation = () => {
        const newAnimate = !user.animate;
        updateUser({ animate: newAnimate } );
        toggleMotion(newAnimate);
    };

    return (
        <Button onClick={toggleAnimation}>
            <Icon svg={icon} />
        </Button>
    );
};

export default AnimationSwitch;
