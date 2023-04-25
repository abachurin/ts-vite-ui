import { useState } from "react";

export default function useToggle(initValue: boolean): [boolean, (value: boolean | undefined) => void] {
    const [value, setValue] = useState<boolean>(initValue);

    function toggleValue(value: boolean | undefined) {
        setValue((currentValue) =>
            value || !currentValue
        );
    }

    return [value, toggleValue];
}
