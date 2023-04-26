import { RgbaColor } from "./types";

// GLOBAL parameters
export const GLOBAL = {
    colors: {
        white: "rgba(235, 235, 235, 1)" as RgbaColor,
        orange: "rgba(255, 120, 1, 1)" as RgbaColor,
        neon: "rgba(255, 130, 255, 1)" as RgbaColor,
    },
    backgrounds: {
        blur: "rgba(255, 255, 255, 0.1)" as RgbaColor,
        pearl: "rgb(226, 223, 210)",
        black: "rgb(0, 0, 0)",
        blue: "rgba(64, 128, 255, 0.1)" as RgbaColor,
        pink: "rgba(255, 130, 255, 0.3)" as RgbaColor,
    },
    numOfStars: {
        small: 200,
        big: 300,
    },
    depthOfStarField: 5,
    borderRadius: "0.3em",
    padding: "0.5em",
    boxShadow: "0 0 0.5em 0.1em rgba(255, 255, 255, 0.2)",
    starSpeed: 5,
    windowResizeDelay: 200,
    logoScale: 1.4,
    navBreakpoint: 600,
    maxContainerWidth: 1400,
    minPaneWidth: 340,
    svg: {
        menu: "M3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm1 5a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4z",
        robot: "M5 16c0 3.87 3.13 7 7 7s7-3.13 7-7v-4H5v4zM16.12 4.37l2.1-2.1-.82-.83-2.3 2.31C14.16 3.28 13.12 3 12 3s-2.16.28-3.09.75L6.6 1.44l-.82.83 2.1 2.1C6.14 5.64 5 7.68 5 10v1h14v-1c0-2.32-1.14-4.36-2.88-5.63zM9 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
        yesMotion:
            "M15 2c-2.71 0-5.05 1.54-6.22 3.78-1.28.67-2.34 1.72-3 3C3.54 9.95 2 12.29 2 15c0 3.87 3.13 7 7 7 2.71 0 5.05-1.54 6.22-3.78 1.28-.67 2.34-1.72 3-3C20.46 14.05 22 11.71 22 9c0-3.87-3.13-7-7-7zM9 20c-2.76 0-5-2.24-5-5 0-1.12.37-2.16 1-3 0 3.87 3.13 7 7 7-.84.63-1.88 1-3 1zm3-3c-2.76 0-5-2.24-5-5 0-1.12.37-2.16 1-3 0 3.86 3.13 6.99 7 7-.84.63-1.88 1-3 1zm4.7-3.3c-.53.19-1.1.3-1.7.3-2.76 0-5-2.24-5-5 0-.6.11-1.17.3-1.7.53-.19 1.1-.3 1.7-.3 2.76 0 5 2.24 5 5 0 .6-.11 1.17-.3 1.7zM19 12c0-3.86-3.13-6.99-7-7 .84-.63 1.87-1 3-1 2.76 0 5 2.24 5 5 0 1.12-.37 2.16-1 3z",
        noMotion:
            "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
        yesSound:
            "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
        noSound:
            "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
        closeWindow:
            "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    },
    userLevel: {
        guest: 0,
        user: 1,
        admin: 2,
    },
};

/**
 * Generate a random number between start and end (inclusive).
 * @param end - The maximum number to generate.
 * @param start - The minimum number to generate (defaults to 0).
 */
export function randomNum(end: number, start = 0): number {
    return Math.random() * (end - start) + start;
}

/**
 * Scrolls smoothly to the first element matching the given CSS selector.
 * @param selector - The CSS selector of the element to scroll to.
 */
export function smoothScroll(selector: string): void {
    document.querySelector(selector)?.scrollIntoView({
        behavior: "smooth",
    });
}

/**
 * Convert an RGBA color to the same RGB color, but not transparent.
 * @param color - An RGBA color in the format "rgba(r, g, b, a)".
 */
export function rgba_rgb(color: RgbaColor): string {
    const numbers = color
        .slice(5, color.length - 1)
        .split(",")
        .map((p) => Number(p));
    const opacity = numbers[3];
    return `rgb(${numbers[0] * opacity}, ${numbers[1] * opacity}, ${
        numbers[2] * opacity
    })`;
}
