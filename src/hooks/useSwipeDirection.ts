import { useState, useEffect, useRef } from "react";
import { GLOBAL } from "../utils";

/**
 * Hook that detects the swipe direction based on touch event above some HTML element
 * @param minSwipeDistance - minimum distance required for a swipe to be detected
 * @return - useRef to the HTML element
 * and the swipe direction: 0, 1, 2, 3 for left, up, right, down. -1 if none.
 */
const useSwipeDirection = (
    minSwipeDistance = GLOBAL.minSwipeDistance
): { ref: React.RefObject<HTMLDivElement>; swipeDirection: number } => {
    const ref = useRef<HTMLDivElement>(null);
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

        const currentRef = ref.current;
        currentRef &&
            currentRef.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            currentRef &&
                currentRef.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [minSwipeDistance]);

    return { ref, swipeDirection };
};

export default useSwipeDirection;
