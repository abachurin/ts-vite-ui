import { useState, useLayoutEffect } from "react";
import { GLOBAL } from "../utils";

const gameBoard = document.getElementById("game-board");

/**
 * Hook that detects the swipe direction based on touch events.
 * @param minSwipeDistance - minimum distance required for a swipe to be detected
 * @return - The swipe direction: 0, 1, 2, 3 for left, up, right, down. -1 if none.
 */
const useSwipeDirection = (minSwipeDistance = GLOBAL.minSwipeDistance) => {
    const [swipeDirection, setSwipeDirection] = useState(-1);

    useLayoutEffect(() => {
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
        console.log(gameBoard);

        gameBoard && gameBoard.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            gameBoard &&
                gameBoard.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [minSwipeDistance]);

    return swipeDirection;
};

export default useSwipeDirection;
