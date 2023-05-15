import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";
import { uniqueId } from "lodash-es";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../../utils";
import GameCell from "./GameCell";

// Emotion styles
const makeEmotion = (
    color1: string,
    color2: string,
    color3: string,
    color: string
): SerializedStyles => css`
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
        margin-block: ${GLOBAL.padding};
    }
    & > header > * {
        flex: 1;
        padding: ${GLOBAL.padding};
        ba
    }
    & > main {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 2px;
    }
`;

type GameBoardProps = {
    size: string;
    score: number;
    moves: number;
    values: number[];
    lastTile?: number;
    nextMove?: number;
    isOver?: boolean | undefined;
};
const GameBoard = ({
    size,
    score,
    moves,
    values,
    lastTile = -1,
    nextMove,
    isOver,
}: GameBoardProps) => {
    const palette = usePalette();

    const emotion = useMemo(
        () =>
            makeEmotion(
                palette.two,
                palette.three,
                palette.one,
                palette.background
            ),
        [palette]
    );
    console.log(size);

    return (
        <div css={emotion}>
            <header>
                <label>Score: {score}</label>
                <label>Moves: {moves}</label>
                {nextMove !== undefined ? (
                    <label>Next Move: {nextMove}</label>
                ) : null}
                {isOver && <label>Game over!</label>}
            </header>
            <main>
                {values.map((value, idx) => (
                    <GameCell
                        key={uniqueId()}
                        size={size}
                        value={value}
                        blink={idx === lastTile}
                    />
                ))}
            </main>
        </div>
    );
};

export default GameBoard;
