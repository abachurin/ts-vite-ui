import { useUser } from "../../../contexts/UserProvider/UserContext";
import {
    useMode,
    useModeUpdate,
} from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useAlert from "../../../hooks/useAlert";
import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import PaneBody from "../PaneBody";
import GameBoard from "./GameBoard";
import PlayFooter from "./PlayFooter";
import WatchFooter from "./WatchFooter";
import WatchModal from "./WatchModal";
import ReplayModal from "./ReplayModal";
import Button from "../../base/Button/Button";
import Instruction from "./Instruction";

/**
 * Renders the Game Pane component on the right, goes bottom on small screen.
 */
const PaneGame = () => {
    const user = useUser();
    const [instruction, openInstruction] = useAlert({
        onlyOnce: true,
        type: "info",
        duration: 100000,
        children: user.legends ? <Instruction /> : null,
    });

    const palette = usePalette();
    const mode = useMode();
    const gameMode = mode.game;
    const modeUpdate = useModeUpdate();

    const playYourself = () => {
        modeUpdate({ game: "play" });
        openInstruction();
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
            <PaneBody>
                <GameBoard />
            </PaneBody>
            {gameMode === "play" ? <PlayFooter /> : <WatchFooter />}
            {instruction}
        </Pane>
    );
};

export default PaneGame;
