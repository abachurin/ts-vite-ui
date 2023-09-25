import { useState, useEffect, useRef } from "react";
import { GLOBAL } from "../utils/utils";

/**
 * Hook to kep track of dimensions of window or some specific HTML element.
 * Don't use if element is in the DOM conditionally.
 * @param elem - True if the dimensions are for an element, False for window object
 * @param delay - debounce in milliseconds
 * @returns {width, height, ref, triggerResize} - attach ref to desired element if elem=true
 * call triggerResize() if you need to enforce measurement
 */
const useDimensions = ({
    elem = false,
    delay = GLOBAL.windowResizeDelay,
}: {
    elem?: boolean;
    delay?: number;
}): {
    width: number;
    height: number;
    ref: React.RefObject<HTMLDivElement>;
    triggerResize: () => void;
} => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [trigger, setTrigger] = useState(true);
    const triggerResize = () => {
        setTrigger((prev) => !prev);
    };

    const timer = useRef<NodeJS.Timeout>();
    useEffect(() => {
        const handleSize = () => {
            setWidth(elem ? ref.current?.clientWidth || 0 : window.innerWidth);
            setHeight(
                elem ? ref.current?.clientHeight || 0 : window.innerHeight
            );
        };
        handleSize();

        const delayedHandleSize = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(handleSize, delay);
        };

        window.addEventListener("resize", delayedHandleSize);
        return () => {
            window.removeEventListener("resize", delayedHandleSize);
        };
    }, [delay, elem, trigger]);

    return { width, height, ref, triggerResize };
};

export default useDimensions;
