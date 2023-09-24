import { useState, useEffect } from "react";

const keyToMove: Record<string, number> = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowRight: 2,
    ArrowDown: 3,
};

/**
 * Returns the current arrow key value, left-up-right-down as defined in keyToMove,
 * -1 if any other key is pressed. Resets to -1 immediately.
 */
const useArrowKey = (): number => {
    const [arrowKey, setArrowKey] = useState(-1);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            e.preventDefault();
            const modalIsOpen =
                document.getElementById("modal")?.innerHTML !== "";
            if (modalIsOpen) return;
            const { key } = e;
            const move = keyToMove[key] ?? -1;
            setArrowKey(move);
            setTimeout(() => {
                setArrowKey(-1);
            }, 0);
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return arrowKey;
};

export default useArrowKey;
