import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
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

// Helper functions
const keyToMove: Record<string, number> = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowRight: 2,
    ArrowDown: 3,
};

const useArrowKey = (): number => {
    const [arrowKey, setArrowKey] = useState(-1);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const modalIsOpen =
                document.getElementById("modal")?.innerHTML !== "";
            if (modalIsOpen) return;
            const { key } = event;
            const move = keyToMove[key] ?? -1;
            setArrowKey(move);
            setTimeout(() => {
                setArrowKey(-1);
            }, 0);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return arrowKey;
};

const PlayFooter = () => {
    const palette = usePalette();
    const arrowKey = useArrowKey();
    const fullMove = useGameStore((state) => state.fullMove);
    const newGame = useGameStore((state) => state.newGame);

    useEffect(() => {
        if (arrowKey >= 0) {
            fullMove(arrowKey);
        }
    }, [arrowKey, fullMove]);

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
                NEW GAME
            </Button>
        </div>
    );
};

export default PlayFooter;
