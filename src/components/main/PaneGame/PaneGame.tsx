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

    const gameMode = useModeStore((state) => state.gameMode);
    const gameName = useModeStore((state) => state.gameName);
    const setGameMode = useModeStore((state) => state.setGameMode);

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
                <WatchModal />
                <ReplayModal />
                <Button background={palette.one} onClick={playYourself}>
                    Play Yourself
                </Button>
            </PaneHeader>
            <PaneBody>
                <GameBoard />
                <div css={emotion}>
                    {gameMode === "play" ? (
                        <PlayFooter />
                    ) : gameMode === "watch" || gameMode === "replay" ? (
                        <WatchFooter />
                    ) : null}
                </div>
            </PaneBody>
            {instruction}
        </Pane>
    );
};

export default PaneGame;
