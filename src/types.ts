// CSS-related types
export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type Alignment = "left" | "center" | "right";
export type ModalState = boolean | "none";

// HTML-related types
export type EventKey = keyof HTMLElementEventMap | keyof WindowEventMap;
export type EventCallback = (e: Event) => void;
export type OnClickFunction = (el: HTMLButtonElement, volume: number) => void;
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

// Button types
export type ButtonVariants = "whooshRotate" | "clickPress";
