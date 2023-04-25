import { createContext, useState, useContext } from "react";
import { User, UserPartial, UpdateUser, ChildrenProps } from "../../types";
import { GLOBAL } from "../utils";

const guest: User = {
    name: "Login",
    level: GLOBAL.level.guest,
    soundLevel: 1,
    sound: true,
    animationInverseSpeed: 5,
    animate: true,
    legends: true,
}

const UserContext = createContext<User>(guest);
const UserUpdateContext = createContext<UpdateUser>(() => {});

export function useUser() {
    return useContext(UserContext);
}

export function useUpdateUser() {
    return useContext(UserUpdateContext);
}

const UserProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState(guest);

    const changeUser = (update: UserPartial) => {
        setUser({ ...user, ...update });
    };

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={changeUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
}

export default UserProvider
