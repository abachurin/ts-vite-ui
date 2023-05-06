import { useState } from "react";
import useEventListener from "./useEventListener";

/**
 * A custom hook that returns a boolean indicating whether the screen width is less than a specified breakpoint.
 * @param {number} breakpoint - The breakpoint width in pixels.
 */
const useSmallScreen = (breakpoint: number) => {
    const isSmallScreen = (): boolean => window.innerWidth < breakpoint;

    const [hiddenNavigation, setHiddenNavigation] = useState<boolean>(
        isSmallScreen()
    );
    useEventListener("resize", () => setHiddenNavigation(isSmallScreen()));

    return hiddenNavigation;
};

export default useSmallScreen;
