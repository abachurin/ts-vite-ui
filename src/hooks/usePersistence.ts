import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

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
