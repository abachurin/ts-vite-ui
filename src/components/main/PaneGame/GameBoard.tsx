import { css } from "@emotion/react";
import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gameMoves } from "../../../gameLogic";
import { fetchNewMovesTiles } from "../../../api/requests";
import useModeStore from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import {
    usePalette,
    useSoundVolume,
} from "../../../contexts/UserProvider/UserContext";
import useSwipeDirection from "../../../hooks/useSwipeDirection";
import { NewMovesRequest, NewMovesResponse } from "../../../types";
import { GLOBAL } from "../../../utils/utils";
import GameCell from "./GameCell";

// Emotion styles
const makeEmotion = (
    color1: string,
    color2: string,
    color3: string,
    color: string
) => css`
    display: flex;
    flex-direction: column;
    margin-top: calc(${GLOBAL.padding} * 2);
    gap: ${GLOBAL.padding};
    & > header {
        width: 100%;
        display: flex;
        gap: ${GLOBAL.padding};
        background: linear-gradient(135deg, ${color1}, ${color2}, ${color3});
        color: ${color};
        text-align: center;
        text-transform: uppercase;
        font-size: 0.85rem;
        border-radius: 2px;
    }
    & > header > * {
        flex: 1;
        padding: ${GLOBAL.padding};
    }
    & > main {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 2px;
    }
`;

// Helper functions
const minInterval = GLOBAL.gameMinInterval;
const maxInterval = GLOBAL.gameMaxInterval;
const beta = (maxInterval - minInterval) / 100;

const getDelay = (pause: boolean, interval: number): number => {
    if (pause) return 0;
    return minInterval + beta * interval * interval;
};

const keyToMove: Record<string, number> = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowRight: 2,
    ArrowDown: 3,
};
const useArrowKey = (): number => {
    const [arrowKey, setArrowKey] = useState(-1);
    const gameMode = useModeStore((state) => state.gameMode);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (gameMode !== "play") return -1;
            const modalIsOpen =
                document.getElementById("modal")?.innerHTML !== "";
            if (modalIsOpen) return;
            e.preventDefault();
            const { key } = e;
            const move = keyToMove[key] ?? -1;
            setArrowKey(move);
            setTimeout(() => {
                setArrowKey(-1);
            }, 0);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameMode]);

    return arrowKey;
};

/**
 * Renders the Game Board,
 * Looks after new moves in Watch Agent mode,
 * Makes next move at the regular interval
 */
const GameBoard = () => {
    const palette = usePalette();
    const volume = useSoundVolume();

    const gameMode = useModeStore((state) => state.gameMode);

    const game = useGameStore((state) => state.game);
    const watchUser = useGameStore((state) => state.watchUser);
    const watchingNow = useGameStore((state) => state.watchingNow);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);
    const setLoadingWeights = useGameStore((state) => state.setLoadingWeights);
    const appendHistory = useGameStore((state) => state.appendHistory);
    const fullMove = useGameStore((state) => state.fullMove);
    const interval = useGameStore((state) => state.interval);
    const paused = useGameStore((state) => state.paused);

    const { ref, swipeDirection } = useSwipeDirection();

    // Move on swipe, on mobile devices. Swipe should start somewhere on the Board
    useEffect(() => {
        const modalIsOpen = document.getElementById("modal")?.innerHTML !== "";
        if (modalIsOpen) return;
        if (gameMode === "play" && swipeDirection !== -1) {
            fullMove(swipeDirection, volume);
        }
    }, [swipeDirection, gameMode, volume, fullMove]);

    // Move on keyboard arrow press
    const arrowKey = useArrowKey();
    useEffect(() => {
        if (arrowKey >= 0) {
            fullMove(arrowKey, volume);
        }
    }, [arrowKey, volume, fullMove]);

    // Fetch new moves when in Watch mode
    const request: NewMovesRequest = {
        userName: watchUser,
        numMoves: game.moves.length,
    };
    const { data } = useQuery<NewMovesResponse>(
        ["newMoves", request],
        () => fetchNewMovesTiles(request),
        {
            refetchInterval: GLOBAL.watchInterval,
            enabled: watchingNow && watchUser !== "",
        }
    );
    const moves = data?.moves || null;
    const tiles = useMemo(() => data?.tiles ?? [], [data]);
    useEffect(() => {
        if (moves) {
            appendHistory(moves, tiles);
            if (moves[moves.length - 1] === -1) setWatchingNow(false);
        }
    }, [moves, tiles, appendHistory, setWatchingNow]);

    // close Replay and Watch modals when loadingWeights changes to false
    const loadingStatus = data?.loadingWeights ?? false;
    useEffect(() => {
        setLoadingWeights(loadingStatus);
    }, [loadingStatus, setLoadingWeights]);

    // Making next move after user-set interval
    const delay = getDelay(paused, interval);
    useEffect(() => {
        let timerId: NodeJS.Timer;
        if (delay) {
            timerId = setInterval(fullMove, delay);
        }
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [delay, fullMove]);

    const emotion = useMemo(
        () =>
            makeEmotion(
                palette.one,
                palette.three,
                palette.two,
                palette.background
            ),
        [palette]
    );

    const values = game.row.flatMap((row) => row);
    const lastTilePosition =
        (game.lastTile?.position.x ?? 0) * 4 +
        (game.lastTile?.position.y ?? -1);
    const showNextMove =
        game.nextMove === undefined ? "..." : gameMoves[game.nextMove];

    return (
        <div ref={ref} css={emotion}>
            <header>
                <div>Score: {game.score}</div>
                <div>Moves: {game.pointer.move}</div>
                {game.nextMove !== -1 && !game.isOver && (
                    <label>Next: {showNextMove}</label>
                )}
                {game.isOver && <label>Game over!</label>}
            </header>
            <main>
                {values.map((value, idx) => (
                    <GameCell
                        key={idx}
                        value={value}
                        blink={idx === lastTilePosition}
                    />
                ))}
            </main>
        </div>
    );
};

export default GameBoard;
