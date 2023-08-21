import { css } from "@emotion/react";
import useGameStore from "../../../store/gameStore";
import { usePalette } from "../../../contexts/UserProvider/UserContext";
import useModeStore from "../../../store/modeStore";
import { connectAPI } from "../../../api/utils";
import { GameWatchNew } from "../../../types";
import { GLOBAL, randomName } from "../../../utils";
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

const WatchFooter = () => {
    const palette = usePalette();

    const interval = useGameStore((state) => state.interval);
    const setWatchGame = useGameStore((state) => state.setWatchGame);
    const restartGame = useGameStore((state) => state.restartGame);
    const startNewGame = useGameStore((state) => state.newGame);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);

    const setIntervalValue = useGameStore((state) => state.setIntervalValue);
    const paused = useGameStore((state) => state.paused);
    const setPaused = useGameStore((state) => state.setPaused);

    const watchUser = useGameStore((state) => state.watchUser);
    const loadingWeights = useGameStore((state) => state.loadingWeights);
    const setLoadingWeights = useGameStore((state) => state.setLoadingWeights);

    const gameMode = useModeStore((state) => state.gameMode);

    const launchNewGame = async () => {
        setWatchingNow(false);
        setPaused(true);
        setLoadingWeights(true);

        const row = startNewGame();
        const name = randomName("game");
        const startGame = {
            name: name,
            initial: row,
            score: 0,
            numMoves: 0,
        };
        setWatchGame(name);

        await connectAPI<GameWatchNew, void>({
            method: "post",
            endpoint: "/watch/new_game",
            data: {
                user: watchUser,
                startGame: startGame,
            },
        });
        setWatchingNow(true);
        setPaused(false);
    };

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
                    onClick={() => setPaused(!paused)}
                >
                    {paused ? "RESUME" : "PAUSE"}
                </Button>
                {gameMode === "watch" ? (
                    <Button
                        type='clickPress'
                        background={palette.four}
                        onClick={launchNewGame}
                        disabled={loadingWeights}
                        legend='Agent is not initialized yet, or need to reload'
                    >
                        NEW GAME
                    </Button>
                ) : null}
                <Button
                    type='clickPress'
                    background={palette.three}
                    onClick={restartGame}
                >
                    RESTART
                </Button>
            </footer>
        </div>
    );
};

export default WatchFooter;
