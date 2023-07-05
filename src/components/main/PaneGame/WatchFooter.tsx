import { css, SerializedStyles } from "@emotion/react";
import { useMemo } from "react";

import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";

import { GLOBAL } from "../../../utils";

import RangeInput from "../../base/RangeInput";
import ButtonGroup from "../../base/Button/ButtonGroup";
import Button from "../../base/Button/Button";

// Emotion styles
const makeEmotion = (): SerializedStyles => css`
    display: flex;
    flex-direction: column;
    margin-top: ${GLOBAL.padding};
    gap: ${GLOBAL.padding};
    & > footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: ${GLOBAL.padding};
    }
`;

const WatchFooter = () => {
    const palette = usePalette();

    const interval = useGameStore((state) => state.interval);
    const restartGame = useGameStore((state) => state.restartGame);
    const setIntervalValue = useGameStore((state) => state.setIntervalValue);
    const paused = useGameStore((state) => state.paused);
    const setPaused = useGameStore((state) => state.setPaused);

    const emotion = useMemo(() => makeEmotion(), [palette]);

    return (
        <div css={emotion}>
            <header></header>
            <main>
                <RangeInput
                    start={0}
                    end={10}
                    step={0.1}
                    initialValue={interval}
                    controlSizeRatio={2.5}
                    controlColor={palette.three}
                    color={palette.text}
                    onChange={setIntervalValue}
                />
            </main>
            <footer>
                <Button
                    type='clickPress'
                    background={paused ? palette.two : palette.one}
                    width='8rem'
                    onClick={() => setPaused(!paused)}
                >
                    {paused ? "RESUME" : "PAUSE"}
                </Button>
                <Button
                    type='clickPress'
                    background={palette.three}
                    width='8rem'
                    onClick={restartGame}
                >
                    RESTART
                </Button>
            </footer>
        </div>
    );
};

export default WatchFooter;
