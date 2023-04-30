import { useState, useLayoutEffect, useRef } from "react";
import { GLOBAL } from "../utils";

/**
 * Returns a tuple with a React ref, width, and height based on the size of the referenced HTML element.
 * @param delay Optional delay before updating dimensions in milliseconds (default: value of GLOBAL.windowResizeDelay)
 */
const useDimensions = (
    delay = GLOBAL.windowResizeDelay
): [React.RefObject<HTMLDivElement>, number, number] => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        function handleSize() {
            setWidth(ref.current?.clientWidth || 0);
            setHeight(ref.current?.clientHeight || 0);
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
    }, [delay]);

    return [ref, width, height];
};

export default useDimensions;
