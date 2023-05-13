import { useModeUpdate } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import useAlert from "../../hooks/useAlert";
import Pane from "./Pane";
import PaneHeader from "./PaneHeader";
import WatchModal from "./WatchModal";
import ReplayModal from "./ReplayModal";
import Button from "../base/Button/Button";

// Emotion styles

/**
 * Renders the Game Pane component on the right, goes bottom on small screen.
 */
const PaneAgent = () => {
    const palette = usePalette();
    const modeUpdate = useModeUpdate();
    const [alert, openAlert] = useAlert({
        children: "This is an alert message!",
    });

    const playYourself = () => {
        modeUpdate({ game: "play" });
        openAlert();
    };

    return (
        <Pane id='game-pane'>
            <PaneHeader type='game'>
                <WatchModal />
                <ReplayModal />
                <Button backgroundColor={palette.one} onClick={playYourself}>
                    Play Yourself
                </Button>
            </PaneHeader>
            {alert}
        </Pane>
    );
};

export default PaneAgent;
