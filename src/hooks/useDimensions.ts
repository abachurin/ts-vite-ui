import { useState, useLayoutEffect, useRef } from "react";
import { GLOBAL } from "../utils";

/**
 * Returns {width, height, reference} based on the size of the referenced HTML element.
 * @param delay Optional debounce in milliseconds
 */
const useDimensions = (
    element = true,
    delay = GLOBAL.windowResizeDelay
): { width: number; height: number; ref: React.RefObject<HTMLDivElement> } => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        function handleSize() {
            if (element) {
                setWidth(ref.current?.clientWidth || 0);
                setHeight(ref.current?.clientHeight || 0);
            } else {
                setWidth(window.innerWidth);
                setHeight(window.innerHeight);
            }
        }
        handleSize();

        let timer: NodeJS.Timeout;
        function delayedHandleSize() {
            clearTimeout(timer);
            timer = setTimeout(handleSize, delay);
        }

        window.addEventListener("load", delayedHandleSize);
        window.addEventListener("resize", delayedHandleSize);
        return () => {
            window.removeEventListener("load", delayedHandleSize);
            window.removeEventListener("resize", delayedHandleSize);
        };
    }, [delay, element]);

    return { width, height, ref };
};

export default useDimensions;
