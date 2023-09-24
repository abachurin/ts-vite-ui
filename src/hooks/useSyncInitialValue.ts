import { useState, useEffect, useMemo } from "react";

/**
 * useState with a transform function + synchronization with initialValue
 * @param initialValue - initial value.
 * @param transform - optional function that transforms the initial value, identity by default
 */
const useSyncInitialValue = <T>(
    initialValue: T,
    transform?: (val: T) => T
): [T, (value: T) => void] => {
    const _transform = useMemo(() => {
        return transform === undefined ? (val: T) => val : transform;
    }, [transform]);
    const [value, setValue] = useState<T>(_transform(initialValue));

    useEffect(() => {
        setValue(_transform(initialValue));
    }, [initialValue, _transform]);

    return [value, setValue];
};

export default useSyncInitialValue;
