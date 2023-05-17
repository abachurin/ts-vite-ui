import { create } from "zustand";
import { Game, GameLogic, GameTile } from "./gameLogic";

function cutHistory(game: Game): Game {
    game.movesHistory = game.movesHistory.slice(0, game.pointer.move);
    game.tilesHistory = game.tilesHistory.slice(0, game.pointer.tile);
    return game;
}

function appendHistory(
    game: Game,
    newMoves: number[],
    newTiles: GameTile[]
): Game {
    game.movesHistory = { ...game.movesHistory, ...newMoves };
    game.tilesHistory = { ...game.tilesHistory, ...newTiles };
    return game;
}

function fullMove(game: Game, move?: number): Game {
    const _move = move ?? game.nextMove;
    const tile = game.tilesHistory[game.pointer.tile];
    const [afterMove, change] = GameLogic.makeMove(game, _move);
    if (change) return GameLogic.newTile(afterMove, tile);
    return afterMove;
}

interface GameStore {
    game: Game;
    fullMove: (move?: number) => void;
    cutHistory: () => void;
    appendHistory: (newMoves: number[], newTiles: GameTile[]) => void;
    newGame: () => void;
    restartGame: () => void;
}

const useGameStore = create<GameStore>()((set) => ({
    game: GameLogic.newGame(),

    fullMove: (move?: number) =>
        set((state) => ({
            game: fullMove(state.game, move),
        })),

    cutHistory: () => set((state) => ({ game: cutHistory(state.game) })),

    appendHistory: (newMoves: number[], newTiles: GameTile[]) =>
        set((state) => ({
            game: appendHistory(state.game, newMoves, newTiles),
        })),

    newGame: () => set(() => ({ game: GameLogic.newGame() })),

    restartGame: () =>
        set((state) => ({ game: GameLogic.restartGame(state.game) })),
}));

export default useGameStore;
