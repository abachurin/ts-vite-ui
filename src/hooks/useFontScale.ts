import { useState, useEffect, useRef, useCallback } from "react";
import { GLOBAL } from "../utils";

/**
 * Calculates the scaling factor for the SVG Icons, depending on the current root font size.
 */
const reScale = (): number => {
    const rootFontSize = getComputedStyle(document.documentElement).fontSize;
    return (
        (GLOBAL.logoScale *
            +rootFontSize.substring(0, rootFontSize.length - 2)) /
        16
    );
};

/**
 * Hook to calculate the font scaling factor.
 * @param delay - debounce delay
 * @return font scaling factor
 */
const useFontScale = (delay = GLOBAL.windowResizeDelay): number => {
    const [scale, setScale] = useState(reScale());

    const timer = useRef<NodeJS.Timeout>();

    const handleSize = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setScale(reScale);
        }, delay);
    }, [delay]);

    useEffect(() => {
        window.addEventListener("resize", handleSize);
        return () => {
            window.removeEventListener("resize", handleSize);
        };
    }, [handleSize]);

    return scale;
};

export default useFontScale;
