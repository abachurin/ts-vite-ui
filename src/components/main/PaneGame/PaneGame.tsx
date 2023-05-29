import { useUser } from "../../../contexts/UserProvider/UserContext";
import useGameStore from "../../../store/gameStore";
import {
    useMode,
    useModeUpdate,
} from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useAlert from "../../../hooks/useAlert";
import { smoothScroll } from "../../../utils";
import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import PaneBody from "../PaneBody";
import GameBoard from "./GameBoard";
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
    const modeUpdate = useModeUpdate();
    const mode = useMode();
    const newGame = useGameStore((state) => state.newGame);

    const playYourself = () => {
        if (mode.game === "none") newGame();
        modeUpdate({ game: "play" });
        openInstruction();
        setTimeout(() => {
            smoothScroll("#game-pane");
        }, 50);
    };

    return (
        <Pane id='game-pane'>
            <PaneHeader type='game'>
                <WatchModal />
                <ReplayModal />
                <Button background={palette.one} onClick={playYourself}>
                    Play Yourself
                </Button>
            </PaneHeader>
            <PaneBody>
                <GameBoard />
            </PaneBody>
            {instruction}
        </Pane>
    );
};

export default PaneGame;
