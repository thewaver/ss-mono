import { createContext, onCleanup, onMount, untrack, useContext } from "solid-js";

export type FieldResetRegistry = {
    register: (reset: () => void) => () => void;
};

const FieldResetContext = createContext<FieldResetRegistry>();

export const FieldResetProvider = FieldResetContext.Provider;

export const useFieldReset = <T>(getValue: () => T, apply: (value: T) => void) => {
    const registry = useContext(FieldResetContext);

    if (registry === undefined) return;

    onMount(() => {
        const initial = untrack(getValue);

        onCleanup(registry.register(() => apply(initial)));
    });
};
