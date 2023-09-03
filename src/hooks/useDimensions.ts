import { useState, useLayoutEffect, useRef, useCallback } from "react";
import { GLOBAL } from "../utils";

/**
 * Hook to kep track pf dimensions of window or some specific HTML element.
 * @param element - True if the dimensions are for an element, False for window object
 * @param delay - debounce in milliseconds
 * @returns {width, height, ref}
 *
 */
const useDimensions = (
    element = false,
    delay = GLOBAL.windowResizeDelay
): { width: number; height: number; ref: React.RefObject<HTMLDivElement> } => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const timer = useRef<NodeJS.Timeout>();

    const handleSize = useCallback(() => {
        if (element) {
            setWidth(ref.current?.clientWidth || 0);
            setHeight(ref.current?.clientHeight || 0);
        } else {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
    }, [element]);

    useLayoutEffect(() => {
        handleSize();
        const delayedHandleSize = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(handleSize, delay);
        };

        window.addEventListener("load", delayedHandleSize);
        window.addEventListener("resize", delayedHandleSize);
        return () => {
            window.removeEventListener("load", delayedHandleSize);
            window.removeEventListener("resize", delayedHandleSize);
        };
    }, [delay, handleSize]);

    return { width, height, ref };
};

export default useDimensions;
