import { useEffect, useState } from "react";

const keyToMove: Record<string, number> = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowRight: 2,
    ArrowDown: 3,
};

function useArrowKeys(): number {
    const [arrowKey, setArrowKey] = useState(-1);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const modalIsOpen =
                document.getElementById("modal")?.innerHTML !== "";
            if (modalIsOpen) return;
            const { key } = event;
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
}

export default useArrowKeys;
