import { useEffect, useState } from "react";

const useMotion = () => {
    const mediaQueryList = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );
    const [noMotion, setNoMotion] = useState(mediaQueryList.matches);

    useEffect(() => {
        const handleChange = (e: MediaQueryListEvent): void => {
            setNoMotion(e.matches);
        };
        mediaQueryList.addEventListener("change", handleChange);
        return () => {
            mediaQueryList.removeEventListener("change", handleChange);
        };
    });

    return noMotion;
};

export default useMotion;
