import {
    useMode,
    useModeUpdate,
} from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import PaneBody from "../PaneBody";
import GameBoard from "./GameBoard";
import WatchModal from "./WatchModal";
import ReplayModal from "./ReplayModal";
import Button from "../../base/Button/Button";

// Emotion styles

/**
 * Renders the Game Pane component on the right, goes bottom on small screen.
 */
const PaneGame = () => {
    const palette = usePalette();
    const mode = useMode();
    const gameMode = mode.game;
    const modeUpdate = useModeUpdate();

    const playYourself = () => {
        modeUpdate({ game: "play" });
    };

    const values = Array.from({ length: 16 }, (_, i) => i);
    const footer = gameMode === "play" ? "play" : "watch";

    return (
        <Pane id='game-pane'>
            <PaneHeader type='game'>
                <WatchModal />
                <ReplayModal />
                <Button backgroundColor={palette.one} onClick={playYourself}>
                    Play Yourself
                </Button>
            </PaneHeader>
            <PaneBody>
                <GameBoard
                    size={"5rem"}
                    score={0}
                    moves={0}
                    values={values}
                    lastTile={15}
                />
            </PaneBody>
        </Pane>
    );
};

export default PaneGame;
