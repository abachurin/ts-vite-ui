import { GLOBAL } from "../../utils";
import { useUser, useUpdateUser } from "../../contexts/UserContext";
import Button from "../base/Button";
import Icon from "../base/Icon";

/**
* Renders a "mute" button that toggles the sound setting of the User,
* with Icon depending on sound state.
 */
const SoundSwitch = () => {
    const user = useUser();
    const updateUser = useUpdateUser();
    const isSound = user.sound;
    const icon = isSound ? GLOBAL.svg.yesSound : GLOBAL.svg.noSound;

    const toggleSound = () => {
        updateUser({ sound: !isSound });
    };

    return (
        <Button onClick={toggleSound}>
            <Icon svg={icon} />
        </Button>
    );
}

export default SoundSwitch;
