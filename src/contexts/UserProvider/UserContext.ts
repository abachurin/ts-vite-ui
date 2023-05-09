import { createContext, useContext } from "react";
import { palettes } from "./palette";
import { GLOBAL } from "../../utils";

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

export const defaultUser: User = {
    name: "Login",
    level: GLOBAL.userLevel.guest,
    soundLevel: 1,
    sound: true,
    animationSpeed: 6,
    animate: true,
    legends: true,
    paletteName: "One",
};

export const UserContext = createContext<User>(defaultUser);
export const UserUpdateContext = createContext<(update: Partial<User>) => void>(
    (update: Partial<User>) => console.log("hello " + update)
);

export const useUser = () => useContext(UserContext);
export const useUserUpdate = () => useContext(UserUpdateContext);

export const usePalette = () => {
    const user = useUser();
    return palettes[user.paletteName];
};
