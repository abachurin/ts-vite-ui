import { useContext } from "react";
import {
    UserContext,
    UserUpdateContext,
} from "../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

/**
 * Renders a "mute" button that toggles the sound setting of the User,
 * with Icon depending on sound state.
 */
const SoundSwitch = () => {
    const user = useContext(UserContext);
    const updateUser = useContext(UserUpdateContext);
    const isSound = user.sound;
    const icon = isSound ? GLOBAL.svg.yesSound : GLOBAL.svg.noSound;

    const toggleSound = (): void => {
        updateUser({ sound: !isSound });
    };

    return (
        <Button onClick={toggleSound}>
            <Icon svg={icon} />
        </Button>
    );
};

export default SoundSwitch;
