type PersistenceFunctions = {
    setPersistedValue: (update: string) => void;
    getPersistedValue: () => string;
};
const emptyPersistence: PersistenceFunctions = {
    setPersistedValue: (update: string | number) => {
        console.log(update + " is not persisted");
    },
    getPersistedValue: () => "",
};

/**
 * Creates a setter and getter function for persistence in localStorage.
 * @param persistAs - part of the key, _2048_ is added on top of it
 */
export const createPersistence = (persistAs: string): PersistenceFunctions => {
    if (persistAs === undefined) return emptyPersistence;
    const fullName = "_2048_" + persistAs;
    if (localStorage.getItem(fullName) === null)
        localStorage.setItem(fullName, "");

    const setPersistedValue = (update: string) => {
        localStorage.setItem(fullName, update);
    };
    const getPersistedValue = () => {
        return localStorage.getItem(fullName) ?? "";
    };

    return {
        setPersistedValue,
        getPersistedValue,
    };
};
