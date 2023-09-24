import { AgentTraining, AgentWatchingBase, AgentTesting } from "../types";
import { checkRe, deepEqual, specialAgents } from "./utils";

/**
 * Converts a string input to a number or undefined (empty string "" is considered undefined).
 * @param value - The string input value to be converted.
 */
export const inputToNumber = (value: string): number | undefined => {
    if (value === "") return undefined;
    const valueNum = +value;
    return isNaN(valueNum) ? undefined : valueNum;
};

/**
 * Checks if an object has at least one property with a value of undefined.
 * @param obj - object
 */
export const hasUndefinedValues = (obj: Record<string, unknown>): boolean => {
    return Object.values(obj).some(
        (value) => value === undefined || value === null || Number.isNaN(value)
    );
};

export const trainParamConstraints = {
    alpha: {
        min: 0.1,
        max: 0.25,
        step: 0.01,
        isInteger: false,
    },
    decay: {
        min: 0.5,
        max: 1.0,
        step: 0.01,
        isInteger: false,
    },
    step: {
        min: 1000,
        max: 10000,
        step: 1000,
        isInteger: true,
    },
    minAlpha: {
        min: 0.0,
        max: 0.05,
        step: 0.001,
        isInteger: false,
    },
    episodes: {
        min: 5000,
        max: 100000,
        step: 5000,
        isInteger: true,
    },
};

export const watchParamConstraints = {
    depth: {
        min: 0,
        max: 2,
        step: 1,
    },
    width: {
        min: 1,
        max: 4,
        step: 1,
    },
    trigger: {
        min: 0,
        max: 6,
        step: 1,
    },
};

export const testParamConstraints = {
    ...watchParamConstraints,
    episodes: {
        min: 100,
        max: 10000,
        step: 100,
    },
};

type Constraints = {
    min: number;
    max: number;
};
const outOfConstraints = <T>(
    val: number | "" | undefined,
    constraints: Constraints & T
): boolean => {
    return (
        val === undefined ||
        val === "" ||
        val > constraints.max ||
        val < constraints.min
    );
};

export const defaultTrainingParams: AgentTraining = {
    N: 2,
    alpha: 0.25,
    decay: 0.9,
    step: 1000,
    minAlpha: 0.01,
    episodes: 5000,
    name: "",
    isNew: true,
};

export const defaultWatchParams: AgentWatchingBase = {
    depth: 0,
    width: 1,
    trigger: 0,
    name: "",
};

export const defaultTestingParams: AgentTesting = {
    ...defaultWatchParams,
    episodes: 100,
};

/**
 *  Returns an object with all values undefined
 */
export const makeUndefinedVersion = (obj: Record<string, unknown>): unknown => {
    const result = { ...obj };
    for (const key in obj) {
        result[key] = undefined;
    }
    return result;
};

export const undefinedTrainingParams = {
    ...(makeUndefinedVersion(defaultTrainingParams) as AgentTraining),
    isNew: true,
};

export const undefinedWatchParams = makeUndefinedVersion(
    defaultWatchParams
) as AgentWatchingBase;

export const undefinedTestingParams = makeUndefinedVersion(
    defaultTestingParams
) as AgentTesting;

/**
 * Validates Train Agent Job parameters.
 * @param values - parameters to be validated
 * @return A tuple containing the validated parameters
 * and a boolean indicating if any values were changed during validation.
 */
type trainKeyType = keyof typeof trainParamConstraints;
export const validateTrainParams = (
    values: Partial<AgentTraining>
): [Partial<AgentTraining>, boolean] => {
    const validated = { ...values };
    if (!values.isNew) {
        const val = values.episodes;
        const constraints = trainParamConstraints.episodes;
        if (outOfConstraints(val, constraints) || !Number.isInteger(val))
            validated.episodes = "";
    } else {
        if (!checkRe(values.name)) validated.name = undefined;
        for (const key in trainParamConstraints) {
            if (key in values) {
                const val = values[key as trainKeyType] as
                    | number
                    | undefined
                    | "";
                const constraints = trainParamConstraints[key as trainKeyType];
                if (
                    outOfConstraints(val, constraints) ||
                    (constraints.isInteger && !Number.isInteger(val))
                ) {
                    validated[key as trainKeyType] = "";
                }
            }
        }
    }
    return [
        validated,
        !deepEqual(validated, values) || hasUndefinedValues(validated),
    ];
};

/**
 * Validates Test and Watch Agent Job parameters.
 * @param values - parameters to be validated
 * @return A tuple containing the validated parameters
 * and a boolean indicating if any values were changed during validation.
 */
type testKeyType = keyof typeof testParamConstraints;
export const validateTestParams = (
    values: Partial<AgentTesting>
): [Partial<AgentTesting>, boolean] => {
    const validated = { ...values };
    if (
        !checkRe(values.name) &&
        !specialAgents.includes(values.name ?? "x x x")
    )
        validated.name = undefined;
    for (const key in testParamConstraints) {
        if (key in values) {
            const val = values[key as testKeyType] as number | undefined | "";
            const constraints = testParamConstraints[key as testKeyType];
            if (outOfConstraints(val, constraints) || !Number.isInteger(val)) {
                validated[key as testKeyType] = "";
            }
        }
    }
    return [
        validated,
        !deepEqual(validated, values) || hasUndefinedValues(validated),
    ];
};
