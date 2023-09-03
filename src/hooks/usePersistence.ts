import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

/**
 * Hook for managing Local Storage persistence for Input, Dropdown etc.
 * @param userName - username to use for persistence
 * @param persistAs - name to use as part of local storage key
 * @param containedIn - an optional array of strings tht should contain the persisted value
 * @return A tuple containing the current value and a function it.
 */
const usePersistence = (
    userName = "dummy-user",
    persistAs = "dummy-storage",
    containedIn?: string[]
): [string, (update: string) => void] => {
    const fullName = userName + persistAs + "__2048";
    const [value, setValue] = useState(GLOBAL.filler);

    useEffect(() => {
        const persistedValue = localStorage.getItem(fullName) ?? GLOBAL.filler;
        if (
            (containedIn && containedIn.includes(persistedValue)) ||
            !containedIn
        ) {
            setValue(persistedValue);
        } else {
            setValue(containedIn[0]);
        }
    }, [fullName]);

    const changeValue = (update: string) => {
        localStorage.setItem(fullName, update);
        setValue(update);
    };

    return [value, changeValue];
};

export default usePersistence;
