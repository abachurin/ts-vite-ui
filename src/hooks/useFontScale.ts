import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

const reScale = (): number => {
    const rootFontSize = getComputedStyle(
        document.documentElement
    ).fontSize;
    return (GLOBAL.logoScale * 
        Number(rootFontSize.substring(0, rootFontSize.length - 2))) / 16;
};

/**
 * Returns a font scaling factor that re-renders on window resize.
 * @param delay - The number of milliseconds to wait after a window resize event before
 * re-rendering the font scaling factor. Defaults to the GLOBAL.windowResizeDelay.
 */
const useFontScale = (delay = GLOBAL.windowResizeDelay): number => {
    const [scale, setScale] = useState(reScale());

    useEffect(() => {
        let timer: NodeJS.Timeout;
        function handleSize() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setScale(reScale);
            }, delay);
        }

        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    }, [delay]);

    return scale;
}

export default useFontScale;
