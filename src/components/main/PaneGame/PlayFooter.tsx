import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import useModeStore from "../../../store/modeStore";
import useGameStore from "../../../store/gameStore";
import {
    usePalette,
    useSoundVolume,
} from "../../../contexts/UserProvider/UserContext";
import { ButtonVariants } from "../../../types";
import { GLOBAL, changeBrightness } from "../../../utils/utils";
import Button from "../../base/Button/Button";
import CloseButton from "../../base/Button/CloseButton";

// Emotion styles
const emotion = css`
    display: flex;
    flex-direction: column;
    margin-top: ${GLOBAL.padding};
    gap: ${GLOBAL.padding};
    & > main {
        margin-block: ${GLOBAL.padding};
        flex: 1;
        display: flex;
        justify-content: center;
    }
    & > main > section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: calc(${GLOBAL.padding} * 2);
    }
    & > footer {
        margin-top: ${GLOBAL.padding};
        display: flex;
        align-items: center;
        gap: ${GLOBAL.padding};
    }
    & > footer > div:nth-of-type(1) {
        flex: 1;
    }
`;

/**
 * Game Pane footer when mode is "Play Yourself"
 */
const PlayFooter = () => {
    const palette = usePalette();
    const volume = useSoundVolume();

    const setGameMode = useModeStore((state) => state.setGameMode);

    const fullMove = useGameStore((state) => state.fullMove);
    const newGame = useGameStore((state) => state.newGame);

    const arrowProps = {
        type: "clickPress" as ButtonVariants,
        fontSize: "2rem",
        width: "7rem",
        height: "3rem",
        mute: true,
    };

    const colorUp = changeBrightness(palette.header, palette.headerOpacity);
    const colorFooter = `linear-gradient(135deg, ${palette.one}, ${palette.three}, ${palette.two})`;

    return (
        <div css={emotion}>
            <main>
                <Button
                    {...arrowProps}
                    background={palette.one}
                    onClick={() => fullMove(0, volume)}
                >
                    &larr;
                </Button>
                <section>
                    <Button
                        {...arrowProps}
                        background={colorUp}
                        onClick={() => fullMove(1, volume)}
                    >
                        &uarr;
                    </Button>
                    <Button
                        {...arrowProps}
                        background={palette.three}
                        onClick={() => fullMove(3, volume)}
                    >
                        &darr;
                    </Button>
                </section>
                <Button
                    {...arrowProps}
                    background={palette.two}
                    onClick={() => fullMove(2, volume)}
                >
                    &rarr;
                </Button>
            </main>
            <footer>
                <div>
                    <Button
                        type='clickPress'
                        background={colorFooter}
                        fontSize='1rem'
                        onClick={() => newGame()}
                    >
                        NEW GAME
                    </Button>
                </div>
                <CloseButton
                    toggleModal='none'
                    onClick={() => setGameMode("none")}
                />
            </footer>
        </div>
    );
};

export default PlayFooter;
