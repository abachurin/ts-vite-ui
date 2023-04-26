import { createContext } from "react";
import { User, UserPartial } from "../../types";
import { GLOBAL } from "../../utils";

export const defaultUser: User = {
    name: "Login",
    level: GLOBAL.userLevel.guest,
    soundLevel: 1,
    sound: true,
    animationInverseSpeed: 5,
    animate: true,
    legends: true,
};

export const UserContext = createContext<User>(defaultUser);
export const UserUpdateContext = createContext<(update: UserPartial) => void>(
    (update: UserPartial) => {
        console.log(update);
    }
);
