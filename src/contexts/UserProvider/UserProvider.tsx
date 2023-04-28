import { useState } from "react";
import { UserContext, UserUpdateContext, defaultUser } from "./UserContext";
import { ChildrenProps, UserPartial } from "../../types";

/**
 * Creates a UserProvider Context Provider.
 * @param children - The child components to be wrapped.
 */
const UserProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState(defaultUser);

    const changeState = (update: UserPartial) => {
        setUser({ ...user, ...update });
    };

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={changeState}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
};

export default UserProvider;
