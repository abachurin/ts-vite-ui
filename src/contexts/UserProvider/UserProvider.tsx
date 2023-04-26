import { useState } from "react";
import { UserContext, UserUpdateContext, defaultUser } from "./UserContext";
import { ChildrenProps, UserPartial } from "../../types";

/**
 * Creates a UserProvider Context Provider.
 * @param children - The child components to be wrapped.
 */
const UserProvider = ({ children }: ChildrenProps) => {
    const [user, setUser] = useState(defaultUser);

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
};

export default UserProvider;
