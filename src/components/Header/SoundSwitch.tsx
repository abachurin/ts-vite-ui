import {
    useUser,
    useUserUpdate,
} from "../../contexts/UserProvider/UserContext";
import { SvgPaths } from "../../utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

/**
 * Renders a "mute" button that toggles the sound setting of the User,
 * with Icon depending on sound state.
 */
const SoundSwitch = () => {
    const user = useUser();
    const updateUser = useUserUpdate();
    const isSound = user.sound;
    const icon = isSound ? SvgPaths.yesSound : SvgPaths.noSound;

    return (
        <Button onClick={() => updateUser({ sound: !isSound })}>
            <Icon svg={icon} />
        </Button>
    );
};

export default SoundSwitch;
