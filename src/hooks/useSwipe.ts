import { useEffect, useState } from "react";

function useSwipe(element: HTMLElement | null | Document = document): number {
    const [swipe, setSwipe] = useState<number>(-1);
    const [startX, setStartX] = useState<number>(0);
    const [startY, setStartY] = useState<number>(0);

    const handleStart = (e: TouchEvent): void => {
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
    };

    const handleEnd = (e: TouchEvent): void => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) + Math.abs(dy) > 100) {
            setStartX(0);
            setStartY(0);

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    setSwipe(2);
                } else {
                    setSwipe(0);
                }
            } else {
                if (dy > 0) {
                    setSwipe(3);
                } else {
                    setSwipe(1);
                }
            }
        }
    };

    useEffect(() => {
        if ("ontouchstart" in window && element != null) {
            console.log("touchstart added");
            document.addEventListener("touchstart", handleStart);
            document.addEventListener("touchend", handleEnd);
            return () => {
                document.removeEventListener("touchstart", handleStart);
                document.removeEventListener("touchend", handleEnd);
            };
        }
    });

    return swipe;
}

export default useSwipe;
