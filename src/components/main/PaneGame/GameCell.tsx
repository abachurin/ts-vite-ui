import { css, keyframes } from "@emotion/react";
import { GLOBAL } from "../../../utils";
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

// Helper functions
const boardColors: Record<number, string> = {
    0: "white",
    1: "hsl(255, 100%, 75%)",
    2: "hsl(300, 100%, 55%)",
    3: "hsl(120, 100%, 40%)",
    4: "hsl(30, 100%, 50%)",
    5: "hsl(192, 100%, 35%)",
    6: "hsl(336, 100%, 50%)",
    7: "hsl(80, 100%, 30%)",
    8: "hsl(30, 30%, 30%)",
    9: "hsl(220, 100%, 70%)",
    10: "hsl(12, 100%, 55%)",
    11: "hsl(165, 100%, 30%)",
    12: "hsl(270, 100%, 40%)",
    13: "hsl(255, 100%, 45%)",
    14: "hsl(0, 100%, 30%)",
    15: "hsl(0, 0%, 20%)",
};

/**
 * Render one game cell for Game Board .
 * @param value - value in the cell
 * @param blink - whether the game cell should blink (last placed tile, if any)
 */
type GameCellProps = {
    value: keyof typeof boardColors;
    blink?: boolean;
};
const GameCell = ({ value, blink = false }: GameCellProps) => {
    const palette = usePalette();

    const emotion = makeEmotion(boardColors[value], palette.background, blink);

    return <div css={emotion}>{value ? 1 << value : ""}</div>;
};

export default GameCell;
