import { css } from "@emotion/react";
import { useEffect } from "react";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useArrowKeys from "../../../hooks/useArrowKeys";
import useSwipe from "../../../hooks/useSwipe";
import { ButtonVariants } from "../../../types";
import { GLOBAL } from "../../../utils";
import Button from "../../base/Button/Button";

// Emotion styles
const emotion = css`
    width: calc(${GLOBAL.gameCellSize} * 4 + ${GLOBAL.gameCellPadding} * 3);
    margin: 0 auto;
    display: flex;
    gap: ${GLOBAL.gameCellPadding};
    & > * {
        flex: 1;
        justify-content: center;
        border: 1px solid yellow;
    }
`;

const PlayFooter = () => {
    const palette = usePalette();
    const key = useArrowKeys();
    const swipe = useSwipe();
    const fullMove = useGameStore((state) => state.fullMove);

    useEffect(() => {
        if (key >= 0) {
            fullMove(key);
        } else if (swipe >= 0) {
            fullMove(swipe);
        }
    }, [key, swipe, fullMove]);

    const arrowProps = {
        type: "clickPress" as ButtonVariants,
        backgroundColor: palette.three,
        fontSize: "2rem",
    };

    return (
        <div css={emotion}>
            <Button {...arrowProps} onClick={() => fullMove(0)}>
                &larr;
            </Button>
            <section>
                <Button {...arrowProps} onClick={() => fullMove(1)}>
                    &uarr;
                </Button>
                <Button {...arrowProps} onClick={() => fullMove(3)}>
                    &darr;
                </Button>
            </section>
            <Button {...arrowProps} onClick={() => fullMove(2)}>
                &rarr;
            </Button>
            <section>
                <Button
                    type='clickPress'
                    width='100%'
                    backgroundColor={palette.one}
                >
                    Restart
                </Button>
                <Button
                    type='clickPress'
                    width='100%'
                    backgroundColor={palette.two}
                >
                    Replay
                </Button>
            </section>
        </div>
    );
};

export default PlayFooter;
