import { useEffect, useState } from "react";
import useGameStore from "../store/gameStore";

const minInterval = 10;
const maxInterval = 5000;
const beta = (maxInterval - minInterval) / 100;

export const getDelay = (pause: boolean, interval: number): number => {
    if (pause) return 0;
    return minInterval + beta * interval * interval;
};

const useNextMoveInterval = () => {
    const interval = useGameStore((state) => state.interval);
    const paused = useGameStore((state) => state.paused);
    const delay = getDelay(paused, interval);

    const move = useGameStore((state) => state.fullMove);

    const [timerId, setTimerId] = useState<NodeJS.Timer>();

    useEffect(() => {
        if (timerId) clearInterval(timerId);
        if (delay) {
            const newTimerId = setInterval(move, delay);
            setTimerId(newTimerId);
        }
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [delay]);
};

export default useNextMoveInterval;
