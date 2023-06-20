import { useState, useEffect } from "react";
import { GLOBAL } from "../utils";

const usePersistence = (
    userName = "dummy-user",
    persistAs = "dummy-storage"
): [string, (update: string) => void] => {
    const fullName = userName + persistAs + "__2048";
    const [value, setValue] = useState(GLOBAL.filler);

    useEffect(() => {
        const persistedValue = localStorage.getItem(fullName) ?? GLOBAL.filler;
        setValue(persistedValue);
    }, [fullName]);

    const changeValue = (update: string) => {
        localStorage.setItem(fullName, update);
        setValue(update);
    };

    return [value, changeValue];
};

export default usePersistence;
