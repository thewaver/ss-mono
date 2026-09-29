import { createContext, onMount, untrack } from "svelte";

export type FieldResetRegistry = {
    register: (reset: () => void) => () => void;
};

export type FieldDefaultRegistry = {
    report: (value: unknown) => () => void;
};

const [getResetContext, setResetContext, hasResetContext] = createContext<FieldResetRegistry>();

const [getDefaultContext, setDefaultContext, hasDefaultContext] = createContext<FieldDefaultRegistry>();

export const setFieldResetContext = (registry: FieldResetRegistry) => setResetContext(registry);

export const setFieldDefaultContext = (registry: FieldDefaultRegistry) => setDefaultContext(registry);

export const useFieldReset = <T>(getValue: () => T, apply: (value: T) => void) => {
    const registry = hasResetContext() ? getResetContext() : undefined;
    const defaults = hasDefaultContext() ? getDefaultContext() : undefined;

    onMount(() => {
        const initial = untrack(getValue);
        const stopReporting = defaults?.report(initial);
        const stopRegistering = registry?.register(() => apply(initial));

        return () => {
            stopRegistering?.();
            stopReporting?.();
        };
    });
};
