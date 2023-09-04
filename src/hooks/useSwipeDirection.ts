import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

const useSwipeDirection = (minSwipeDistance = GLOBAL.minSwipeDistance) => {
    const [swipeDirection, setSwipeDirection] = useState(-1);

    useEffect(() => {
        let touchStartX: number | null = null;
        let touchStartY: number | null = null;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (touchStartX === null || touchStartY === null) {
                return;
            }
            const touch = e.touches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            if (
                Math.abs(deltaX) >= minSwipeDistance ||
                Math.abs(deltaY) >= minSwipeDistance
            ) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    setSwipeDirection(deltaX > 0 ? 2 : 0);
                } else {
                    setSwipeDirection(deltaY > 0 ? 3 : 1);
                }

                touchStartX = null;
                touchStartY = null;
            }
        };

        const handleTouchEnd = () => {
            touchStartX = null;
            touchStartY = null;
            setSwipeDirection(-1);
        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [minSwipeDistance]);

    return swipeDirection;
};

export default useSwipeDirection;
