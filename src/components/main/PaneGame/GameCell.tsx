import { css, keyframes, SerializedStyles } from "@emotion/react";
import { GLOBAL, boardColors } from "../../../utils";
import { usePalette } from "../../../contexts/UserProvider/UserContext";

// Emotion styles
const makeEmotion = (
    backgroundColor: string,
    color: string
): SerializedStyles => css`
    width: ${GLOBAL.gameCellSize};
    height: ${GLOBAL.gameCellSize};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${GLOBAL.gameCellPadding};
    background-color: ${backgroundColor};
    color: ${color};
    font-size: 1rem;
`;
const blinker = keyframes`
    from { opacity: 1.0; }
    to { opacity: 0.5; }
`;

const blinkMe = css`
    animation: ${blinker} 0.5s linear infinite alternate;
`;

type GameCellProps = {
    value: keyof typeof boardColors;
    blink?: boolean;
};
const GameCell = ({ value, blink = false }: GameCellProps) => {
    const palette = usePalette();
    const emotion = css`
        ${makeEmotion(boardColors[value], palette.background)}
        ${blink && blinkMe}
    `;

    return <div css={emotion}>{value ? 1 << value : ""}</div>;
};

export default GameCell;
