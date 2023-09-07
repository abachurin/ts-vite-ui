import { css } from "@emotion/react";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { uniqueId } from "lodash-es";
import { gameMoves } from "../../../gameLogic";
import { fetchNewMovesTiles } from "../../../api/requests";
import useModeStore from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useSwipeDirection from "../../../hooks/useSwipeDirection";
import { NewMovesRequest, NewMovesResponse } from "../../../types";
import { GLOBAL } from "../../../utils";
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

/**
 * Renders the Game Board,
 * Looks after new moves in Watch Agent mode,
 * Makes next move at the regular interval
 */
const GameBoard = () => {
    const palette = usePalette();

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

    const delay = getDelay(paused, interval);

    const { ref, swipeDirection } = useSwipeDirection();
    useEffect(() => {
        if (gameMode === "play" && swipeDirection !== -1) {
            fullMove(swipeDirection);
        }
    }, [swipeDirection, gameMode]);

    const request: NewMovesRequest = {
        userName: watchUser,
        numMoves: game.moves.length,
    };
    const { data } = useQuery<NewMovesResponse>(
        ["newMoves", request],
        () => fetchNewMovesTiles(request),
        {
            refetchInterval: GLOBAL.watchInterval,
            enabled: watchingNow,
        }
    );

    const moves = data?.moves || null;
    const tiles = data?.tiles ?? [];
    const loadingWeights = data?.loadingWeights ?? false;

    useEffect(() => {
        if (moves) {
            appendHistory(moves, tiles);
            if (moves[moves.length - 1] === -1) setWatchingNow(false);
        }
    }, [moves]);

    useEffect(() => {
        setLoadingWeights(loadingWeights);
    }, [loadingWeights]);

    const [timerId, setTimerId] = useState<NodeJS.Timer>();
    useEffect(() => {
        if (timerId) clearInterval(timerId);
        if (delay) {
            const newTimerId = setInterval(fullMove, delay);
            setTimerId(newTimerId);
        }
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [delay]);

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
                        key={uniqueId()}
                        value={value}
                        blink={idx === lastTilePosition}
                    />
                ))}
            </main>
        </div>
    );
};

export default GameBoard;
