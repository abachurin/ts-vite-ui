import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

const reScale = () => {
    const rootFontSize = getComputedStyle(
        document.documentElement
    ).fontSize;
    return (GLOBAL.logoScale * 
        Number(rootFontSize.substring(0, rootFontSize.length - 2))) / 16;
};

export default function useFontScale(delay = GLOBAL.windowResizeDelay) {
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
