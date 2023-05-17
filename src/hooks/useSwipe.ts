import { useEffect, useState } from "react";

function useSwipe(): number {
    const [swipe, setSwipe] = useState<number>(-1);

    useEffect(() => {
        function handleTouchStart(event: TouchEvent) {
            const touchStartX = event.touches[0].clientX;
            const touchStartY = event.touches[0].clientY;

            function handleTouchEnd(event: TouchEvent) {
                const touchEndX = event.changedTouches[0].clientX;
                const touchEndY = event.changedTouches[0].clientY;

                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;
                console.log(dx, dy);

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

            document.addEventListener("touchend", handleTouchEnd);
            return () => {
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }

        if ("ontouchstart" in window) {
            document.addEventListener("touchstart", handleTouchStart);
        }
        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

    return swipe;
}

export default useSwipe;
