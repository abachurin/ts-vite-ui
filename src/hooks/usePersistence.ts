import { useState, useEffect } from "react";

const usePersistence = (
    name = "dummy-storage",
    initialValue = ""
): [string, (update: string) => void] => {
    const [value, setValue] = useState(initialValue || "");

    useEffect(() => {
        const persistedValue = localStorage.getItem(name) || "";
        setValue(persistedValue);
    }, [name]);

    const changeValue = (update: string) => {
        localStorage.setItem(name, update);
        setValue(update);
    };

    return [value, changeValue];
};

export default usePersistence;
