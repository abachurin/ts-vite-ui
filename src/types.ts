// CSS-related types
export type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;
export type Alignment = "left" | "center" | "right";
export type Pixels = `${number}px`;
export type ModalState = boolean | "none";

// HTML-related types
export type EventKey = keyof HTMLElementEventMap | keyof WindowEventMap;
export type EventCallback = (e: Event) => void;
export type OnClickFunction = (el: HTMLButtonElement, volume: number) => void;
export type StyledHTMLElement = HTMLElement & {
    style: CSSStyleDeclaration;
};

// User-related types
export type User = {
    name: string;
    level: number;
    soundLevel: number;
    sound: boolean;
    animationInverseSpeed: number;
    animate: boolean;
    legends: boolean;
};
export type UserPartial = Partial<
    Pick<
        User,
        | "name"
        | "level"
        | "soundLevel"
        | "sound"
        | "animationInverseSpeed"
        | "animate"
        | "legends"
    >
>;
export type UpdateUser = (user: UserPartial) => void;

// Common Prop types
export interface ChildrenProps {
    children?: React.ReactNode;
}
export interface AlignProps {
    align?: Alignment;
}

// Button types
export type ButtonVariants = "whooshRotate" | "clickPress";
