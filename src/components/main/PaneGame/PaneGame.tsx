import { css } from "@emotion/react";
import { useEffect } from "react";
import { killWatchJob } from "../../../api/requests";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useModeStore, { modeDescription } from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
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

// Helper functions
const disableSwipe = () => {
    const swipeBlocker = document.getElementById("swipeBlocker");
    if (swipeBlocker)
        swipeBlocker.textContent = "html * { touch-action: none; }";
};
const enableSwipe = () => {
    const swipeBlocker = document.getElementById("swipeBlocker");
    if (swipeBlocker) swipeBlocker.textContent = "";
};

/**
 * Renders the Game Pane component on the right, goes bottom on small screen.
 */
const PaneGame = () => {
    const user = useUser();
    const palette = usePalette();

    const [instruction, openInstruction] = useAlert({
        onlyOnce: true,
        type: "info",
        duration: 100000,
        children: user.legends ? <Instruction /> : null,
    });

    const { gameMode, setGameMode, gameName } = useModeStore();
    const {
        watchUser,
        setWatchingNow,
        setLoadingWeights,
        newGame,
        cutHistory,
        setPaused,
    } = useGameStore();

    useEffect(() => {
        setWatchingNow(gameMode === "watch");
        if (gameMode !== "watch") {
            setLoadingWeights(false);
            killWatchJob(watchUser);
        }
        if (gameMode === "play") {
            disableSwipe();
        } else enableSwipe();
    }, [gameMode]);

    const playYourself = () => {
        if (gameMode === "play") return;
        if (gameMode === "none") newGame();
        setGameMode("play");
        setPaused(true);
        cutHistory();
        openInstruction();
        setTimeout(() => {
            smoothScroll("#game-pane");
        }, 50);
    };

    return (
        <Pane id='game-pane'>
            <PaneHeader type='game' text={modeDescription(gameMode, gameName)}>
                <ReplayModal />
                <WatchModal />
                <Button background={palette.one} onClick={playYourself}>
                    Play
                </Button>
            </PaneHeader>
            <PaneBody>
                <GameBoard />
                <footer css={emotion}>
                    {gameMode === "play" ? (
                        <PlayFooter />
                    ) : gameMode === "watch" || gameMode === "replay" ? (
                        <WatchFooter />
                    ) : null}
                </footer>
            </PaneBody>
            {instruction}
        </Pane>
    );
};

export default PaneGame;
