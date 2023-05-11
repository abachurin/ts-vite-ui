import { useModeUpdate } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
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

    return (
        <Pane id='game-pane'>
            <PaneHeader type='game'>
                <WatchModal />
                <ReplayModal />
                <Button
                    backgroundColor={palette.one}
                    onClick={() => modeUpdate("play")}
                >
                    Play Yourself
                </Button>
            </PaneHeader>
        </Pane>
    );
};

export default PaneAgent;
