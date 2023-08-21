import { uniqueId } from "lodash-es";
import { Offset, Game, GameTile, GameBackend } from "../types";
import { deepCopy, deepEqual } from "../utils";

export const gameMoves: Record<number, string> = {
    0: "LEFT",
    1: "UP",
    2: "RIGHT",
    3: "DOWN",
};

/**
 * An collection of methods for changing state of Game object.
 * Some functions are written in functional style and are not pure, by design.
 */
export abstract class GameLogic {
    public static restartGame(game: Game): Game {
        const newGame = deepCopy(game);
        newGame.row = deepCopy(game.initial);
        newGame.score = 0;
        newGame.lastTile = undefined;
        newGame.nextMove = game.moves?.[0];
        newGame.pointer = { move: 0, tile: 0 };
        newGame.isOver = false;
        return newGame;
    }

    public static fromBackend(game: GameBackend): Game {
        const fullGame: Game = {
            ...game,
            isOver: false,
            pointer: { move: 0, tile: 0 },
        };
        return this.restartGame(fullGame);
    }

    private static emptyBoard(): number[][] {
        return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    }

    public static emptyGame(): Game {
        return {
            name: "game_" + uniqueId(),
            initial: this.emptyBoard(),
            row: this.emptyBoard(),
            score: 0,
            moves: [],
            tiles: [],
            lastTile: undefined,
            nextMove: undefined,
            pointer: { move: 0, tile: 0 },
            isOver: false,
        };
    }

    public static newGame(): Game {
        const baseGame = this.emptyGame();
        const firstTile = this.newTile(baseGame);
        const game = this.newTile(firstTile);
        game.initial = deepCopy(game.row);
        game.pointer.tile = 0;
        game.tiles = [];
        game.lastTile = undefined;
        return game;
    }

    private static emptyPositions(game: Game): Offset[] {
        const positions: Offset[] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (game.row[i][j] === 0) {
                    positions.push({ x: i, y: j });
                }
            }
        }
        return positions;
    }

    public static gameOver(game: Game | number[][]): boolean {
        const row = Array.isArray(game) ? game : game.row;
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

    private static placeTile(game: Game, tile: GameTile): Game {
        const newGame = deepCopy(game);
        newGame.row[tile.position.x][tile.position.y] = tile.value;
        newGame.lastTile = tile;
        newGame.tiles[newGame.pointer.tile] = tile;
        newGame.pointer.tile++;
        if (this.gameOver(newGame)) {
            newGame.isOver = true;
        }
        return newGame;
    }

    public static newTile(game: Game, tile?: GameTile): Game {
        const newGame = deepCopy(game);
        if (tile) {
            return this.placeTile(game, tile);
        }
        if (game.isOver) return newGame;
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
            const result = this.placeTile(newGame, tile);
            return result;
        }
        return newGame;
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
            const [newLine, score] = this.leftOneLine(game.row[i]);
            newGame.row[i] = [...newLine];
            newGame.score += score;
        }
        return [newGame, !deepEqual(game.row, newGame.row)];
    }

    private static rotate(game: Game, move: number): Game {
        const newGame = deepCopy(game);
        if (move === 0 || move === 4) {
            return newGame;
        }
        const row = game.row;
        const newRow = this.emptyBoard();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                switch (move) {
                    case 1:
                        newRow[i][j] = row[j][3 - i];
                        break;
                    case 2:
                        newRow[i][j] = row[3 - i][3 - j];
                        break;
                    case 3:
                        newRow[i][j] = row[3 - j][i];
                        break;
                    default:
                        throw new Error(`Invalid move: ${move}`);
                }
            }
        }
        newGame.row = newRow;
        return newGame;
    }

    public static makeMove(game: Game, move?: number): [Game, boolean] {
        if (move === undefined) {
            return [deepCopy(game), false];
        }
        const rotatedGame = this.rotate(game, move);
        const [newGame, change] = this.moveLeft(rotatedGame);
        const result = this.rotate(newGame, 4 - move);
        if (change) {
            result.moves[result.pointer.move] = move;
            result.pointer.move++;
            result.nextMove = result.moves[result.pointer.move];
        }
        return [result, change];
    }
}

export default GameLogic;
