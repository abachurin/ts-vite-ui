import { useState, useEffect, useRef } from "react";
import { GLOBAL } from "../utils/utils";

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
        let touchStartX = 0;
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            if (
                Math.abs(deltaX) >= minSwipeDistance ||
                Math.abs(deltaY) >= minSwipeDistance
            ) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    setSwipeDirection(deltaX > 0 ? 2 : 0);
                } else {
                    setSwipeDirection(deltaY > 0 ? 3 : 1);
                }
                touchStartX = 0;
                touchStartY = 0;
            }
        };
        const handleTouchEnd = () => {
            touchStartX = 0;
            touchStartY = 0;
            setSwipeDirection(-1);
        };

        const currentRef = ref.current;
        if (!currentRef) return;

        currentRef.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            currentRef.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [minSwipeDistance]);

    return { ref, swipeDirection };
};

export default useSwipeDirection;
