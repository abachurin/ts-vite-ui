import { EventKey, EventCallback } from "../types";
import { useEffect, useRef } from "react";

/**
 * Registers an event listener on the specified `element` for the given `eventType`,
 * invoking the provided `callback` whenever the event is triggered. The listener
 * is automatically removed when the `element` is unmounted, or when the `eventType`
 * or `fireOnLoad` options change.
 *
 * If `stopPropagation` is set to `true`, the event will only trigger the listener if
 * the target matches the `element`. Otherwise, the event will trigger the listener
 * regardless of the target.
 *
 * @param eventType - The type of event to listen for.
 * @param callback - The function to execute when the event is triggered.
 * @param element - The HTML element to attach the event listener to. Defaults to `window`.
 * @param fireOnLoad - If `true`, the listener will also be triggered when the page
 * finishes loading. Defaults to `true`.
 * @param stopPropagation - If `true`, the event will only trigger the listener if
 * the target matches the `element`. Defaults to `false`.
 */
const  useEventListener = (
    eventType: EventKey,
    callback: EventCallback,
    element = window,
    fireOnLoad = true,
    stopPropagation = false
) => {

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

export default useEventListener;
