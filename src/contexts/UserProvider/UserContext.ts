import { createContext, useContext } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";
import { User } from "../../types";
import { GLOBAL } from "../../utils";
import { palettes } from "../../palette";

export const defaultUser: User = {
    name: "Login",
    level: GLOBAL.userLevel.guest,
    soundLevel: 1,
    sound: true,
    animationSpeed: 6,
    animate: true,
    legends: true,
    paletteName: "One",
    agents: [],
    logs: [],
    lastLog: 0,
};

export const UserContext = createContext<User>(defaultUser);
export const UserUpdateContext = createContext<(update: Partial<User>) => void>(
    (update) => {
        console.log("User Context = " + update);
    }
);

export const useUser = () => useContext(UserContext);
export const useUserUpdate = () => useContext(UserUpdateContext);

export const useUserName = () => {
    const user = useUser();
    return user.name;
};

export const usePalette = () => {
    const user = useUser();
    return palettes[user.paletteName];
};

export const useAnimate = () => {
    const user = useUser();
    const noMotion = useReducedMotion();
    return user.animate && !noMotion;
};

export const useSoundVolume = () => {
    const user = useUser();
    return user.sound ? user.soundLevel : 0;
};

export const useInverseAnimationSpeed = () => {
    const user = useUser();
    return GLOBAL.inverseAnimationCoefficient / user.animationSpeed;
};
