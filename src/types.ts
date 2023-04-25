export type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;
export type RgbColor = `rgb(${number}, ${number}, ${number})`;
export type EventKey = keyof HTMLElementEventMap | keyof WindowEventMap;
export type EventCallback = (e: Event) => void;

export type Alignment = "left" | "center" | "right"

export type User = {
    name: string,
    level: number,
    soundLevel: number,
    sound: boolean,
    animationInverseSpeed: number,
    animate: boolean,
    legends: boolean,
  };
export type UserPartial = Partial<Pick<User, "name" | "level" | "soundLevel" | "sound" | "animationInverseSpeed" | "animate" | "legends">>;
export type UpdateUser = (user: UserPartial) => void

export interface ChildrenProps {
  children?: React.ReactNode
}

export interface AlignProps {
  align?: Alignment
}

export type StyledHTMLElement = HTMLElement & {
  style: CSSStyleDeclaration;
}
