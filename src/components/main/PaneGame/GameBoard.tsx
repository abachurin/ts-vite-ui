import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { uniqueId } from "lodash-es";
import { useMode } from "../../../contexts/ModeProvider/ModeContext";
import { gameMoves } from "../../../store/gameLogic";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../../utils";
import GameCell from "./GameCell";
import PlayFooter from "./PlayFooter";
import WatchFooter from "./WatchFooter";

// Emotion styles
const makeEmotion = (
    color1: string,
    color2: string,
    color3: string,
    color: string
): SerializedStyles => css`
    display: flex;
    flex-direction: column;
    margin-top: ${GLOBAL.padding};
    gap: ${GLOBAL.padding};
    & > header {
        width: 100%;
        display: flex;
        gap: ${GLOBAL.padding};
        background: linear-gradient(135deg, ${color1}, ${color2}, ${color3});
        color: ${color};
        text-align: center;
        text-transform: uppercase;
        font-size: 1rem;
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
    & > footer {
        flex: 1;
    }
`;

const GameBoard = () => {
    const mode = useMode();
    const palette = usePalette();
    const game = useGameStore((state) => state.game);

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

    const values = [
        ...game.row[0],
        ...game.row[1],
        ...game.row[2],
        ...game.row[3],
    ];
    const lastTilePosition =
        (game.lastTile?.position.x ?? 0) * 4 +
        (game.lastTile?.position.y ?? -1);

    return (
        <div id='game-board' css={emotion}>
            <header>
                <div>Score: {game.score}</div>
                <div>Moves: {game.pointer.move}</div>
                {game.nextMove !== undefined ? (
                    <label>Next Move: {gameMoves[game.nextMove]}</label>
                ) : null}
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
            <footer>
                {mode.game === "play" ? (
                    <PlayFooter />
                ) : mode.game === "watch" ? (
                    <WatchFooter />
                ) : null}
            </footer>
        </div>
    );
};

export default GameBoard;
