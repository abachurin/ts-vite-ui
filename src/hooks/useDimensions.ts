import { useState, useLayoutEffect, useRef } from "react";
import { GLOBAL } from "../utils";

/**
 * Returns a tuple with a React ref, width, and height based on the size of the referenced HTML element.
 * @param delay Optional delay before updating dimensions in milliseconds (default: value of GLOBAL.windowResizeDelay)
 */
const useDimensions = (
    element = true,
    delay = GLOBAL.windowResizeDelay
): [number, number, React.RefObject<HTMLDivElement>] => {
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

    return [width, height, ref];
};

export default useDimensions;
