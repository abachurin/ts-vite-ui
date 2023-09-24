import { css } from "@emotion/react";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import { GLOBAL } from "../../../utils/utils";
import RangeInput from "../../base/RangeInput";
import Button from "../../base/Button/Button";

// Emotion styles
const emotion = css`
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

/**
 * Game Pane footer when mode is "Watch Agent" or "Replay Game"
 */
const WatchFooter = () => {
    const palette = usePalette();

    const interval = useGameStore((state) => state.interval);
    const setIntervalValue = useGameStore((state) => state.setIntervalValue);
    const paused = useGameStore((state) => state.paused);
    const setPaused = useGameStore((state) => state.setPaused);
    const restartGame = useGameStore((state) => state.restartGame);

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
                    label={"Interval between moves"}
                    labelColor={palette.background}
                    labelAbove={false}
                    onChange={setIntervalValue}
                />
            </main>
            <footer>
                <Button
                    type='clickPress'
                    background={paused ? palette.two : palette.one}
                    onClick={() => setPaused(!paused)}
                >
                    {paused ? "RESUME" : "PAUSE"}
                </Button>
                <Button
                    type='clickPress'
                    background={palette.three}
                    onClick={restartGame}
                >
                    REPLAY
                </Button>
            </footer>
        </div>
    );
};

export default WatchFooter;
