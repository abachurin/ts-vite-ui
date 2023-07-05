import { css } from "@emotion/react";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useGameStore from "../../../store/gameStore";
import {
    useMode,
    useModeUpdate,
} from "../../../contexts/ModeProvider/ModeContext";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useAlert from "../../../hooks/useAlert";
import { GLOBAL, smoothScroll } from "../../../utils";
import Pane from "../Pane";
import PaneHeader from "../PaneHeader";
import PaneBody from "../PaneBody";
import GameBoard from "./GameBoard";
import WatchModal from "./WatchModal";
import ReplayModal from "./ReplayModal";
import Button from "../../base/Button/Button";
import Instruction from "./Instruction";
import PlayFooter from "./PlayFooter";
import WatchFooter from "./WatchFooter";

// Emotion styles
const emotion = css`
    width: calc(${GLOBAL.gameCellSize} * 4 + ${GLOBAL.gameCellPadding} * 2);
`;

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
    const cutHistory = useGameStore((state) => state.cutHistory);
    const setPaused = useGameStore((state) => state.setPaused);

    const playYourself = () => {
        if (mode.game === "play") return;
        if (mode.game === "none") newGame();
        modeUpdate({ game: "play" });
        setPaused(true);
        cutHistory();
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
                <div css={emotion}>
                    {mode.game === "play" ? (
                        <PlayFooter />
                    ) : mode.game === "watch" || mode.game === "replay" ? (
                        <WatchFooter />
                    ) : null}
                </div>
            </PaneBody>
            {instruction}
        </Pane>
    );
};

export default PaneGame;
