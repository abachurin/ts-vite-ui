import { createContext } from "react";
import { GLOBAL } from "../../utils";
import { Palette, paletteOne } from "./palette";

export type User = {
    name: string;
    level: number;
    sound: boolean;
    soundLevel: number;
    animate: boolean;
    animationSpeed: number;
    legends: boolean;
    palette: Palette;
};

export const defaultUser: User = {
    name: "Login",
    level: GLOBAL.userLevel.guest,
    soundLevel: 1,
    sound: true,
    animationSpeed: 6,
    animate: true,
    legends: true,
    palette: paletteOne,
};

export const UserContext = createContext<User>(defaultUser);
export const UserUpdateContext = createContext<(update: Partial<User>) => void>(
    (update: Partial<User>) => console.log(update)
);
