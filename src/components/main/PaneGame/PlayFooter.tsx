import { css } from "@emotion/react";
import { useEffect } from "react";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useArrowKeys from "../../../hooks/useArrowKeys";
import { ButtonVariants } from "../../../types";
import { GLOBAL, changeBrightness } from "../../../utils";
import Button from "../../base/Button/Button";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    gap: ${GLOBAL.padding};
    & main {
        margin-block: ${GLOBAL.padding};
        flex: 1;
        display: flex;
        justify-content: center;
    }
    & section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: calc(${GLOBAL.padding} * 2);
    }
`;

const PlayFooter = () => {
    const palette = usePalette();
    const key = useArrowKeys();
    const fullMove = useGameStore((state) => state.fullMove);
    const newGame = useGameStore((state) => state.newGame);

    useEffect(() => {
        if (key >= 0) {
            fullMove(key);
        }
    }, [key, fullMove]);

    const arrowProps = {
        type: "clickPress" as ButtonVariants,
        fontSize: "2rem",
        width: "7rem",
        height: "3rem",
    };
    const colorUp = changeBrightness(palette.header, palette.headerOpacity);
    const colorFooter = `linear-gradient(135deg, ${palette.one}, ${palette.three}, ${palette.two})`;

    return (
        <div css={emotion}>
            <main>
                <Button
                    {...arrowProps}
                    background={palette.one}
                    onClick={() => fullMove(0)}
                >
                    &larr;
                </Button>
                <section>
                    <Button
                        {...arrowProps}
                        background={colorUp}
                        onClick={() => fullMove(1)}
                    >
                        &uarr;
                    </Button>
                    <Button
                        {...arrowProps}
                        background={palette.three}
                        onClick={() => fullMove(3)}
                    >
                        &darr;
                    </Button>
                </section>
                <Button
                    {...arrowProps}
                    background={palette.two}
                    onClick={() => fullMove(2)}
                >
                    &rarr;
                </Button>
            </main>
            <Button
                type='clickPress'
                width='100%'
                background={colorFooter}
                fontSize='1rem'
                onClick={() => newGame()}
            >
                RESTART
            </Button>
        </div>
    );
};

export default PlayFooter;
