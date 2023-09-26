import { createContext, useContext } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";
import { User } from "../../types";
import { GLOBAL } from "../../utils/utils";
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
    const { name } = useUser();
    return name;
};

export const usePalette = () => {
    const { paletteName } = useUser();
    return palettes[paletteName];
};

export const useAnimate = () => {
    const { animate } = useUser();
    const noMotion = useReducedMotion();
    return animate && !noMotion;
};

export const useSoundVolume = () => {
    const { sound, soundLevel } = useUser();
    return sound ? soundLevel : 0;
};

export const useInverseAnimationSpeed = () => {
    const { animationSpeed } = useUser();
    return GLOBAL.inverseAnimationCoefficient / animationSpeed;
};

export const useIsAdmin = () => {
    const { level } = useUser();
    return level >= 2;
};
