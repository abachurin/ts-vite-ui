import { EventKey, EventCallback } from "../types";
import { useEffect, useRef } from "react";


export default function useEventListener(
    eventType: EventKey,
    callback: EventCallback,
    element = window,
    fireOnLoad = true,
    stopPropagation = false
) {

    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (element == null) return;
        const handler = (e: Event) => {
            if (!stopPropagation || e.target === element) {
                callbackRef.current(e);
            }
        };
        if (fireOnLoad) {
            window.addEventListener("load", handler);
        }
        element.addEventListener(eventType, handler);
        return () => {
            element.removeEventListener(eventType, handler);
            if (fireOnLoad) {
                window.removeEventListener("load", handler);
            }
        };
    }, [eventType, element, fireOnLoad, stopPropagation]);
}
