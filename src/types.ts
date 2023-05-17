import { SerializedStyles } from "@emotion/react";

// CSS-related types
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type Alignment = "left" | "center" | "right";
export type ModalState = boolean | "none";

// HTML-related types
export type EventKey = keyof HTMLElementEventMap | keyof WindowEventMap;
export type EventCallback = (e: Event) => void;
export type StyledHTMLElement = HTMLElement & {
    style: CSSStyleDeclaration;
};
export type InputType =
    | "text"
    | "password"
    | "email"
    | "number"
    | "search"
    | "tel"
    | "url";

// Common Prop types
export interface ChildrenProps {
    children?: React.ReactNode;
}
export interface AlignProps {
    align?: Alignment;
}

// User styles
export type User = {
    name: string;
    level: number;
    sound: boolean;
    soundLevel: number;
    animate: boolean;
    animationSpeed: number;
    legends: boolean;
    paletteName: string;
};

export type LoginUser = {
    name: string;
    pwd: string;
    action: "login" | "register";
};

// Palette styles
export interface Palette {
    name: string;
    background: RGB;
    text: RGB;
    header: RGB;
    headerOpacity: number;
    logo: RGB;
    pane: RGB;
    paneOpacity: number;
    one: RGB;
    two: RGB;
    three: RGB;
    success: RGB;
    error: RGB;
    warning: RGB;
    info: RGB;
}

export type Palettes = {
    [name: string]: Palette;
};

// Button types
export type ButtonVariants = "whooshRotate" | "clickPress";
export type ButtonExtraStyle = (background: string) => SerializedStyles;
export type ButtonEffects = (
    el: HTMLButtonElement,
    volume: number | User,
    animate: boolean
) => void;

// Mode types
export type ModeOfAction = {
    agent: "none" | "train" | "test";
    game: "watch" | "replay" | "play";
};

// Draggable types
export type Position = {
    x: string;
    y: string;
};
export type Offset = {
    x: number;
    y: number;
};
export type PositionType = "fixed" | "absolute";

// Alert types
export type AlertColors = "success" | "error" | "warning" | "info";
