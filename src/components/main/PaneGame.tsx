import { useState } from "react";
import { useModeUpdate } from "../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../contexts/UserProvider/UserContext";
import Pane from "./Pane";
import PaneHeader from "./PaneHeader";
import WatchModal from "./WatchModal";
import ReplayModal from "./ReplayModal";
import Button from "../base/Button/Button";
import Alert from "../base/Alert";

// Emotion styles

/**
 * Renders the Game Pane component on the right, goes bottom on small screen.
 */
const PaneAgent = () => {
    const palette = usePalette();
    const modeUpdate = useModeUpdate();
    const [showAlert, setShowAlert] = useState(false);

    const playYourself = () => {
        setShowAlert(true);
        modeUpdate({ game: "play" });
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
            {showAlert && (
                <Alert>
                    <p>This is an alert message!</p>
                </Alert>
            )}
        </Pane>
    );
};

export default PaneAgent;
