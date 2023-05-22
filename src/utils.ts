import { RGB, RGBA } from "./types";
import { User } from "./types";

// GLOBAL parameters
export const GLOBAL = {
    numOfStars: {
        small: 200,
        big: 300,
    },
    depthOfStarField: 5,
    borderRadius: "0.3rem",
    padding: "0.5rem",
    boxShadow: "0 0 0.5em 0.1em rgba(255, 255, 255, 0.2)",
    littleShadow: "0 0 0.5em 0.1em rgba(0, 0, 0, 0.2)",
    middleShadow: "0 0 0.5em 0.1em rgba(0, 0, 0, 0.5)",
    insetShadow: (color: string, blurRadius = 0.5) =>
        `inset 0 0 ${blurRadius}rem 0.1rem ${color}`,
    starSpeed: 5,
    windowResizeDelay: 300,
    logoScale: 1.4,
    navBreakpoint: 600,
    maxContainerWidth: 1400,
    minPaneWidth: 340,
    gameCellSize: "6rem",
    gameCellPadding: "3px",
    contactButtonWidth: "12rem",
    messageDuration: 5000,
    userLevel: {
        guest: 0,
        user: 1,
        admin: 2,
    },
};

export const SvgPaths = {
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
    email: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
    leftArrow: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    rightArrow: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    login: "M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z",
};

export const boardColors: Record<number, string> = {
    0: "white",
    1: "hsl(255, 100%, 75%)",
    2: "hsl(300, 100%, 55%)",
    3: "hsl(120, 100%, 40%)",
    4: "hsl(30, 100%, 50%)",
    5: "hsl(192, 100%, 35%)",
    6: "hsl(336, 100%, 50%)",
    7: "hsl(80, 100%, 30%)",
    8: "hsl(30, 30%, 30%)",
    9: "hsl(220, 100%, 70%)",
    10: "hsl(12, 100%, 55%)",
    11: "hsl(165, 100%, 30%)",
    12: "hsl(270, 100%, 40%)",
    13: "hsl(255, 100%, 45%)",
    14: "hsl(0, 100%, 30%)",
    15: "hsl(0, 0%, 20%)",
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
    document
        .querySelector(selector)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Splits RGBA color object into an array of 4 numbers.
 * @param color - The RGBA color object to destructure.
 */
const destructureColor = (color: RGB | RGBA): number[] => {
    const startOfNumbers = (color as string).indexOf("(") + 1;
    return color
        .slice(startOfNumbers, color.length - 1)
        .split(",")
        .map((v) => +v);
};

/**
 * Convert an RGBA color to the same hue RGB color, but not transparent.
 * @param color - An RGBA color in the format "rgba(r, g, b, a)".
 */
export function removeTransparency(color: RGB | RGBA): RGB {
    const numbers = destructureColor(color);
    const opacity = numbers[3] ?? 1;
    return `rgb(${numbers[0] * opacity}, ${numbers[1] * opacity}, ${
        numbers[2] * opacity
    })`;
}

/**
 * Returns an RGBA color string with the given opacity.
 * @param color - The RGBA color to adjust transparency for.
 * @param opacity - The opacity value, between 0 and 1.
 */
export function setTransparency(color: RGB | RGBA, opacity: number): RGBA {
    const numbers = destructureColor(color);
    return `rgba(${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${
        opacity > 1 ? 1 : opacity < 0 ? 0 : opacity
    })`;
}

/**
 * Returns an RGBA color string with the given opacity.
 * @param color - The RGBA color to adjust transparency for.
 * @param opacity - The opacity value, between 0 and 1.
 */
export function changeBrightness(color: RGB, ratio: number): RGB {
    const numbers = destructureColor(color).map((v) =>
        Math.min(v * ratio, 255)
    );
    return `rgb(${numbers[0]}, ${numbers[1]}, ${numbers[2]})`;
}

/**
 * Creates and plays a new Audio object with the specified sound and volume.
 * @param sound - The URL, file path or already imported sound object.
 * @param volume - The volume level of the sound, between 0 and 1.
 */
export function makeSound(sound: string, volumeSource: number | User): void {
    const audio = new Audio(sound);
    if (typeof volumeSource === "number") {
        audio.volume = volumeSource;
    } else {
        audio.volume = volumeSource.sound ? volumeSource.soundLevel : 0;
    }
    audio.play();
}

/**
 * Checks if the given string has only letters, numbers, dashes and underscores.
 * @param text - The text to check
 */
export function checkRe(text: string | undefined): boolean {
    const re = /^[0-9A-Za-z-_]+$/;
    return text !== undefined && re.test(text);
}

/**
 * Performs a deep copy of the given object by first serializing it to JSON and then
 * deserializing it back into a new object.
 */
export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if two Objects are deeply equal.
 */
export function deepEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}
