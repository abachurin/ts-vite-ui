import { useState } from "react";
import useEventListener from "./useEventListener";

const useSmallScreen = (breakpoint: number) => {
    const isSmallScreen = (): boolean => window.innerWidth < breakpoint;

    const [hiddenNavigation, setHiddenNavigation] = useState<boolean>(
        isSmallScreen()
    );
    useEventListener("resize", () => setHiddenNavigation(isSmallScreen()));

    return hiddenNavigation;
};

export default useSmallScreen;
