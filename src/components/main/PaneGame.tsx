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
    const [open, setOpen] = useState(false);

    const playYourself = () => {
        setOpen(true);
        setTimeout(() => setOpen(false), 5000);
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
            <Alert isOpen={open}>
                <h1>Ola!</h1>
            </Alert>
        </Pane>
    );
};

export default PaneAgent;
