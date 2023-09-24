import { css, keyframes } from "@emotion/react";
import { GLOBAL, boardColors } from "../../../utils/utils";
import { usePalette } from "../../../contexts/UserProvider/UserContext";

// Emotion styles
const blinker = keyframes`
    from { opacity: 1.0; }
    to { opacity: 0.5; }
`;
const blinkMe = css`
    animation: ${blinker} 0.5s linear infinite alternate;
`;
const makeEmotion = (
    backgroundColor: string,
    color: string,
    blink: boolean
) => css`
    width: ${GLOBAL.gameCellSize};
    height: ${GLOBAL.gameCellSize};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${GLOBAL.gameCellPadding};
    background-color: ${backgroundColor};
    color: ${color};
    font-size: 1rem;
    ${blink && blinkMe}
`;

/**
 * Render one game cell for Game Board .
 * @param value - value in the cell
 * @param blink - whether the game cell should blink (last placed tile, if any)
 */
type GameCellProps = {
    value: number;
    blink?: boolean;
};
const GameCell = ({ value, blink = false }: GameCellProps) => {
    const palette = usePalette();

    const emotion = makeEmotion(
        boardColors[value as keyof typeof boardColors],
        palette.background,
        blink
    );

    return <div css={emotion}>{value ? 1 << value : ""}</div>;
};

export default GameCell;
