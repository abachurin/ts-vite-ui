import { useEffect, useState } from "react";

/**
 * Hook to check if user prefers reduced motion.
 * @return true or false
 */
const useReducedMotion = () => {
    const mediaQueryList = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );
    const [noMotion, setNoMotion] = useState(mediaQueryList.matches);

    const handleChange = (e: MediaQueryListEvent): void => {
        setNoMotion(e.matches);
    };

    useEffect(() => {
        mediaQueryList.addEventListener("change", handleChange);
        return () => {
            mediaQueryList.removeEventListener("change", handleChange);
        };
    });

    return noMotion;
};

export default useReducedMotion;
