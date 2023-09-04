import { create } from "zustand";
import GameLogic from "../gameLogic";
import { Game, GameTile, GameBackend } from "../types";
import { deepCopy } from "../utils";

const minInterval = 10;
const maxInterval = 5000;
const beta = (maxInterval - minInterval) / 100;

const cutHistory = (game: Game): Game => {
    const newGame = deepCopy(game);
    newGame.moves = game.moves.slice(0, game.pointer.move);
    newGame.tiles = game.tiles.slice(0, game.pointer.tile);
    newGame.nextMove = undefined;
    return newGame;
};

const appendHistory = (
    game: Game,
    newMoves: number[],
    newTiles: GameTile[]
): Game => {
    const newGame = deepCopy(game);
    newGame.moves = [...game.moves, ...newMoves];
    newGame.tiles = [...game.tiles, ...newTiles];
    if (game.pointer.move === game.moves.length) newGame.nextMove = newMoves[0];
    return newGame;
};

const fullMove = (game: Game, move?: number): Game | null => {
    const _move = move ?? game.nextMove;
    if (_move === undefined || _move === -1) return null;
    const tile = game.tiles[game.pointer.tile];
    const [afterMove, change] = GameLogic.makeMove(game, _move);
    if (change) return GameLogic.newTile(afterMove, tile);
    return null;
};

interface GameStore {
    game: Game;
    interval: number;
    paused: boolean;
    watchUser: string;
    watchingNow: boolean;
    loadingWeights: boolean;
    setPaused: (newPaused: boolean) => void;
    setIntervalValue: (newInterval: number) => void;
    setWatchUser: (newWatchUser: string) => void;
    setWatchingNow: (watching: boolean) => void;
    setLoadingWeights: (loading: boolean) => void;
    fullMove: (move?: number) => void;
    cutHistory: () => void;
    appendHistory: (newMoves: number[], newTiles: GameTile[]) => void;
    newGame: () => number[][];
    assignGame: (game: GameBackend) => void;
    restartGame: () => void;
}
const useGameStore = create<GameStore>()((set, get) => ({
    game: GameLogic.emptyGame(),
    interval: 4,
    paused: true,
    watchUser: "",
    watchGame: "",
    watchingNow: false,
    loadingWeights: true,

    get delay() {
        const interval = get().interval;
        return get().paused ? 0 : minInterval + beta * interval * interval;
    },

    setPaused: (newPaused: boolean) => set(() => ({ paused: newPaused })),
    setIntervalValue: (newInterval) => set(() => ({ interval: newInterval })),
    setWatchUser: (newWatchUser: string) =>
        set(() => ({ watchUser: newWatchUser })),
    setWatchingNow: (watching: boolean) =>
        set(() => ({ watchingNow: watching })),
    setLoadingWeights: (loading: boolean) => {
        set(() => ({ loadingWeights: loading }));
    },

    fullMove: (move?: number) => {
        const newGame = fullMove(get().game, move);
        newGame && set(() => ({ game: newGame }));
    },

    cutHistory: () => set((state) => ({ game: cutHistory(state.game) })),

    appendHistory: (newMoves: number[], newTiles: GameTile[]) =>
        set((state) => ({
            game: appendHistory(state.game, newMoves, newTiles),
        })),

    newGame: () => {
        const newBoard = GameLogic.newGame();
        set(() => ({ game: newBoard }));
        return newBoard.initial;
    },

    assignGame: (newGame: GameBackend) => {
        set(() => ({ game: GameLogic.fromBackend(newGame) }));
    },

    restartGame: () =>
        set((state) => ({ game: GameLogic.restartGame(state.game) })),
}));

export default useGameStore;
