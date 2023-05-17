import { useEffect, useState } from "react";

function useArrowKeys(): number {
    const [arrowKey, setArrowKey] = useState<number>(-1);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const { key } = event;
            switch (key) {
                case "ArrowLeft":
                    setArrowKey(0);
                    break;
                case "ArrowUp":
                    setArrowKey(1);
                    break;
                case "ArrowRight":
                    setArrowKey(2);
                    break;
                case "ArrowDown":
                    setArrowKey(3);
                    break;
                default:
                    setArrowKey(-1);
                    break;
            }
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
