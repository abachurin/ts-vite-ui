import { createContext, useContext } from "react";
import useMotion from "../../hooks/useReducedMotion";
import { User } from "../../types";
import { GLOBAL } from "../../utils";
import { palettes } from "../palette";

export const defaultUser: User = {
    name: "Login",
    level: GLOBAL.userLevel.admin,
    soundLevel: 1,
    sound: true,
    animationSpeed: 6,
    animate: true,
    legends: true,
    paletteName: "One",
};

export const UserContext = createContext<User>(defaultUser);
export const UserUpdateContext = createContext<(update: Partial<User>) => void>(
    (update) => {
        console.log("User Context = " + update);
    }
);

export const useUser = () => useContext(UserContext);
export const useUserUpdate = () => useContext(UserUpdateContext);

export const usePalette = () => {
    const user = useUser();
    return palettes[user.paletteName];
};

export const useAnimate = () => {
    const user = useUser();
    const noMotion = useMotion();
    return user.animate && !noMotion;
};
