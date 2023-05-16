import { uniqueId } from "lodash-es";
import { Offset } from "../types";
import { deepCopy, deepEqual } from "../utils";

export const [LEFT, UP, RIGHT, DOWN] = [0, 1, 2, 3];

export type GameTile = {
    position: Offset;
    value: number;
};

export type GamePointer = {
    move: number;
    tile: number;
};

export interface Game {
    idx: string;
    initial: number[][];
    current: number[][];
    score: number;
    movesHistory: number[];
    tilesHistory: GameTile[];
    lastTile?: GameTile;
    nextMove?: number;
    pointer: GamePointer;
    isOver: boolean;
}

/**
 * An collection of methods for changing state of Game object.
 * Some functions are written in functional style and are not pure, by design.
 */
export abstract class GameLogic {
    public static restartGame(game: Game): Game {
        game.current = deepCopy(game.initial);
        game.lastTile = undefined;
        game.nextMove = game.movesHistory?.[0];
        game.pointer = { move: 0, tile: 0 };
        game.isOver = false;
        return game;
    }

    private static emptyBoard(): number[][] {
        return Array(4).fill(Array(4).fill(0));
    }

    public static emptyGame(): Game {
        return {
            idx: "game_" + uniqueId(),
            initial: this.emptyBoard(),
            current: this.emptyBoard(),
            score: 0,
            movesHistory: [],
            tilesHistory: [],
            lastTile: undefined,
            nextMove: undefined,
            pointer: { move: 0, tile: 0 },
            isOver: false,
        };
    }

    public static newGame(): Game {
        const game = this.emptyGame();
        this.newTile(game);
        this.newTile(game);
        game.initial = deepCopy(game.current);
        game.lastTile = undefined;
        return game;
    }

    private static emptyPositions(game: Game): Offset[] {
        const positions: Offset[] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (game.current[i][j] === 0) {
                    positions.push({ x: i, y: j });
                }
            }
        }
        return positions;
    }

    private static gameOver(game: Game): boolean {
        const row = game.current;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (
                    row[i][j] === 0 ||
                    (i > 0 && row[i - 1][j] === row[i][j]) ||
                    (j > 0 && row[i][j - 1] === row[i][j])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    private static placeTile(game: Game, tile: GameTile): void {
        game.current[tile.position.x][tile.position.y] = tile.value;
        game.lastTile = tile;
        game.tilesHistory[game.pointer.tile] = tile;
        game.pointer.tile++;
        if (this.gameOver(game)) {
            game.isOver = true;
        }
    }

    public static newTile(game: Game, tile?: GameTile): void {
        if (tile) {
            this.placeTile(game, tile);
            return;
        }
        if (game.isOver) return;
        const emptyPositions = this.emptyPositions(game);
        if (emptyPositions.length) {
            const { x, y } =
                emptyPositions[
                    Math.floor(Math.random() * emptyPositions.length)
                ];
            const tile = {
                position: {
                    x: x,
                    y: y,
                },
                value: Math.random() < 0.9 ? 1 : 2,
            };
            this.placeTile(game, tile);
        }
    }

    private static leftOneLine(line: number[]): [number[], number] {
        let score = 0;
        if (
            (new Set(line).size === 4 && Math.min(...line) > 0) ||
            Math.max(...line) === 0
        ) {
            return [line.slice(), 0];
        }
        const nonZero = line.filter((v) => v !== 0);
        for (let i = 0; i < nonZero.length - 1; i++) {
            const x = nonZero[i];
            if (x === nonZero[i + 1]) {
                score += 1 << (x + 1);
                nonZero[i] = x + 1;
                nonZero[i + 1] = 0;
            }
        }
        const compacted = nonZero.filter((v) => v !== 0);
        compacted.push(...Array(4 - compacted.length).fill(0));
        return [compacted, score];
    }

    private static moveLeft(game: Game): [Game, boolean] {
        const newGame = deepCopy(game);
        for (let i = 0; i < 4; i++) {
            const [newLine, score] = this.leftOneLine(game.current[i]);
            newGame.current[i] = [...newLine];
            newGame.score += score;
        }
        return [newGame, deepEqual(game.current, newGame.current)];
    }

    private static rotate(game: Game, move: number): Game {
        const newGame = deepCopy(game);
        if (move === LEFT) {
            return newGame;
        }
        const row = game.current;
        const newRow = this.emptyBoard();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                switch (move) {
                    case UP:
                        newRow[i][j] = row[j][3 - i];
                        break;
                    case RIGHT:
                        newRow[i][j] = row[3 - i][3 - j];
                        break;
                    case DOWN:
                        newRow[i][j] = row[3 - j][i];
                        break;
                    default:
                        throw new Error(`Invalid move: ${move}`);
                }
            }
        }
        newGame.current = newRow;
        return newGame;
    }

    public static makeMove(game: Game, move?: number): [Game, boolean] {
        if (!move) {
            return [game, false];
        }
        const rotatedGame = this.rotate(game, move);
        const [newGame, change] = this.moveLeft(rotatedGame);
        const result = this.rotate(newGame, 4 - move);
        if (change) {
            result.movesHistory[result.pointer.move] = move;
            result.pointer.move++;
            result.nextMove = result.movesHistory[result.pointer.move];
        }
        return [result, change];
    }
}

export default GameLogic;
