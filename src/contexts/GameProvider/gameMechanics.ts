interface Game {
    idx: number | null;
    initial: number[][];
    row: number[][];
    score: number;
    n_moves: number;
    last_tile: number[];
    next_move: number | null;
}

class GameLogic {
    private actions: { [key: number]: string };
    private tiles: { [key: number]: string };
    private table: { [key: string]: [number[], number, boolean] };

    constructor() {
        this.actions = { 0: "left", 1: "up", 2: "right", 3: "down" };
        this.tiles = {
            0: "",
            1: "2",
            2: "4",
            3: "8",
            4: "16",
            5: "32",
            6: "64",
            7: "128",
            8: "256",
            9: "512",
            10: "1024",
            11: "2048",
            12: "4096",
            13: "8192",
            14: "16384",
            15: "32768",
        };
        this.table = {};
        this.createTable();
    }

    private emptyGame(): Game {
        return {
            idx: null,
            initial: Array(4).fill(Array(4).fill(0)),
            row: Array(4).fill(Array(4).fill(0)),
            score: 0,
            n_moves: 0,
            last_tile: [-1, -1],
            next_move: null,
        };
    }

    private createTable(): void {
        for (let a = 0; a < 16; a++) {
            for (let b = 0; b < 16; b++) {
                for (let c = 0; c < 16; c++) {
                    for (let d = 0; d < 16; d++) {
                        let score = 0;
                        const line = [a, b, c, d];
                        if (
                            (new Set(line).size === 4 &&
                                Math.min(...line) > 0) ||
                            Math.max(...line) === 0
                        ) {
                            this.table[line.join("")] = [
                                line.slice(),
                                score,
                                false,
                            ];
                            continue;
                        }
                        const line1 = line.filter((v) => v !== 0);
                        for (let i = 0; i < line1.length - 1; i++) {
                            const x = line1[i];
                            if (x === line1[i + 1]) {
                                score += Math.pow(2, x + 1);
                                line1[i] = x + 1;
                                line1[i + 1] = 0;
                            }
                        }
                        const line2 = line1.filter((v) => v !== 0);
                        line2.push(...Array(4 - line2.length).fill(0));
                        this.table[line.join("")] = [
                            line2.slice(),
                            score,
                            !this.arraysEqual(line, line2),
                        ];
                    }
                }
            }
        }
    }

    public newGame(): Game {
        const game = this.emptyGame();
        this.newTile(game);
        this.newTile(game);
        game.initial = JSON.parse(JSON.stringify(game.row));
        game.last_tile = [-1, -1];
        return game;
    }

    private empty(game: Game): [number, number][] {
        const emptyPositions: [number, number][] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (game.row[i][j] === 0) {
                    emptyPositions.push([i, j]);
                }
            }
        }
        return emptyPositions;
    }

    private gameOver(game: Game): boolean {
        const row = game.row;
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

    private newTile(game: Game): void {
        const emptyPositions = this.empty(game);
        if (emptyPositions.length > 0) {
            const tile = Math.random() < 0.9 ? 1 : 2;
            const [i, j] =
                emptyPositions[
                    Math.floor(Math.random() * emptyPositions.length)
                ];
            game.row[i][j] = tile;
            game.last_tile = [i, j];
            if (this.gameOver(game)) {
                game.next_move = -1;
            }
        }
    }

    private placeTile(game: Game, posTile: [number, number, number]): void {
        const [i, j, tile] = posTile;
        game.row[i][j] = tile;
        game.last_tile = [i, j];
        if (this.gameOver(game)) {
            game.next_move = -1;
        }
    }

    private left(game: Game): [Game, boolean] {
        let change = false;
        const newGame = JSON.parse(JSON.stringify(game));
        for (let i = 0; i < 4; i++) {
            const [line, score, changeLine] = this.table[game.row[i].join("")];
            newGame.row[i] = [...line];
            if (changeLine) {
                change = true;
                newGame.score += score;
            }
        }
        newGame.n_moves = game.n_moves + (change ? 1 : 0);
        return [newGame, change];
    }

    private rotate(game: Game, move: number): Game {
        const newGame = JSON.parse(JSON.stringify(game));
        const row = game.row;
        const newRow: number[][] = Array.from({ length: 4 }, () =>
            Array(4).fill(0)
        );
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
                        newRow[i][j] = row[i][j];
                        break;
                }
            }
        }
        newGame.row = newRow;
        return newGame;
    }

    public makeMove(game: Game, move: number): [Game, boolean] {
        const rotatedGame = this.rotate(game, move);
        const [newGame, change] = this.left(rotatedGame);
        const finalGame = this.rotate(newGame, 4 - move);
        return [finalGame, change];
    }
}

export default GameLogic;
