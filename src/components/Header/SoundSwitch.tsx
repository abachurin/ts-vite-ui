import {
    useUser,
    useUserUpdate,
} from "../../contexts/UserProvider/UserContext";
import { SvgPaths } from "../../utils/utils";
import Button from "../base/Button/Button";
import Icon from "../base/Icon/Icon";

/**
 * Renders a "mute/unmute" button that toggles the sound setting of the User,
 * with Icon depending on sound state.
 */
const SoundSwitch = () => {
    const user = useUser();
    const updateUser = useUserUpdate();
    const isSound = user.sound;
    const icon = isSound ? SvgPaths.yesSound : SvgPaths.noSound;

    const handleClick = () => {
        updateUser({ sound: !isSound });
    };

    return (
        <Button onClick={handleClick}>
            <Icon svg={icon} />
        </Button>
    );
};

export default SoundSwitch;
