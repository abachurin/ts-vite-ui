import { useState } from "react";

/**
 * Returns a tuple containing a boolean value and a function to toggle it.
 * @param initValue - The initial value of the boolean.
 */
const useToggle = (initValue: boolean) =>{
    const [value, setValue] = useState<boolean>(initValue);

    function toggleValue(value: boolean | undefined) {
        setValue((currentValue) =>
            value || !currentValue
        );
    }

    return [value, toggleValue] as const;
}

export default useToggle;
