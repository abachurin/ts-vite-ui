import { css } from "@emotion/react";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../../utils/utils";

// Helper functions
const makeEmotion = (color: string) => css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    padding: ${GLOBAL.padding};
    width: 16rem;
    font-weight: 300;
    color: ${color};
    & > header {
        text-transform: uppercase;
        text-align: center;
        padding-bottom: ${GLOBAL.padding};
        border-bottom: 1px solid ${color};
    }
    & > footer {
        font-size: 0.9em;
        padding-bottom: ${GLOBAL.padding};
    }
`;

/**
 * Instruction for Play Yourself
 */
const Instruction = () => {
    const palette = usePalette();

    const emotion = makeEmotion(palette.background);

    return (
        <div css={emotion}>
            <header>Controls</header>
            <main>
                Press arrow buttons or keyboard arrows to move. Swipe on mobile
                devices.
            </main>
            <footer>
                / This instruction can be permanently switched off by turning
                off Verbose option in User Settings /
            </footer>
        </div>
    );
};

export default Instruction;
