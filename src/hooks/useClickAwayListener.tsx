import { useEffect, useRef } from "react";
import { EventCallback } from "../types";

/**
 * A hook that invokes a callback when a click event occurs outside of a specified element.
 * @param {EventCallback} onClickOutside - The callback function to be invoked when a click event
 * occurs outside of the element specified by the ref, provided by the hook
 */
export const useOutsideClick = (onClickOutside: EventCallback) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClickOutside(e);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClickOutside]);

    return ref;
};
