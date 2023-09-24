import { css } from "@emotion/react";
import { useEffect, useCallback } from "react";
import { killWatchJob } from "../../../api/requests";
import { useUser } from "../../../contexts/UserProvider/UserContext";
import useModeStore, { modeDescription } from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useAlert from "../../../hooks/useAlert";
import { GLOBAL, smoothScroll } from "../../../utils/utils";
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
/**
 * Disables swipe functionality by adding a CSS rule to the "swipeBlocker" style element in index.html,
 * so that the user can move by swiping on the game pane without extra effects.
 */
const disableSwipe = () => {
    const swipeBlocker = document.getElementById("swipeBlocker");
    if (swipeBlocker)
        swipeBlocker.textContent = "html * { touch-action: pinch-zoom; }";
};
/**
 * Enables swipe functionality back.
 */
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

    const { appAlert, openAlert } = useAlert({
        onlyOnce: true,
        type: "info",
        duration: 100000,
        children: user.legends ? <Instruction /> : null,
    });

    const gameMode = useModeStore((state) => state.gameMode);
    const setGameMode = useModeStore((state) => state.setGameMode);
    const gameName = useModeStore((state) => state.gameName);

    const watchUser = useGameStore((state) => state.watchUser);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);
    const setLoadingWeights = useGameStore((state) => state.setLoadingWeights);
    const newGame = useGameStore((state) => state.newGame);
    const cutHistory = useGameStore((state) => state.cutHistory);
    const setPaused = useGameStore((state) => state.setPaused);

    useEffect(() => {
        setWatchingNow(gameMode === "watch");
        if (gameMode !== "watch") {
            setLoadingWeights(false);
            killWatchJob(watchUser);
        }
        if (gameMode === "play") {
            disableSwipe();
        } else enableSwipe();
    }, [gameMode, watchUser, setWatchingNow, setLoadingWeights]);

    const playYourself = useCallback(() => {
        if (gameMode === "play") return;
        if (gameMode === "none") newGame();
        setGameMode("play");
        setPaused(true);
        cutHistory();
        openAlert();
        setTimeout(() => {
            smoothScroll("#game-pane");
        }, 50);
    }, [gameMode, newGame, setGameMode, setPaused, cutHistory, openAlert]);

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
            {appAlert}
        </Pane>
    );
};

export default PaneGame;
