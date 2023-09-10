import { useEffect, useRef, useCallback } from "react";

/**
 * A hook that invokes a callback when a click event occurs outside of a specified element.
 * @param onClickOutside - The callback function to be invoked when a click event
 * occurs outside of the element specified by the ref, provided by the hook
 */
export const useClickAwayListener = (
    onClickOutside: (e: MouseEvent) => void
) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                onClickOutside(e);
        },
        [onClickOutside]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return ref;
};
