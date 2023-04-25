import { useState, useEffect, useRef } from "react";
import { GLOBAL } from "../utils";

export default function useDimensions(delay = GLOBAL.windowResizeDelay) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        function handleSize() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setWidth(ref.current?.clientWidth || 0);
                setHeight(ref.current?.clientHeight || 0);
            }, delay);
        }

        window.addEventListener("load", handleSize);
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("load", handleSize);
            window.removeEventListener("resize", handleSize);
        };
    }, [delay]);

    return {
        ref: ref,
        width: width,
        height: height
    };
}
