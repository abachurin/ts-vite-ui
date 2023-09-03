import { useState, useCallback } from "react";
import { UserContext, UserUpdateContext, defaultUser } from "./UserContext";
import { ChildrenProps, User } from "../../types";

/**
 * User Context Provider.
 * @param children - components to be wrapped.
 */
const UserProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState(defaultUser);

    const changeState = useCallback(
        (update: Partial<User>) => {
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
