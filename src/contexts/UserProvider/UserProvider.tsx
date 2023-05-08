import { useState, useMemo } from "react";
import {
    User,
    UserContext,
    UserUpdateContext,
    defaultUser,
} from "./UserContext";
import { ChildrenProps } from "../../types";

/**
 * Creates a UserProvider Context Provider.
 * @param children - The child components to be wrapped.
 */
const UserProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState(defaultUser);

    const changeState = useMemo(
        () => (update: Partial<User>) => {
            setUser((prev) => ({ ...prev, ...update }));
        },
        [setUser]
    );

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={changeState}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
};

export default UserProvider;
