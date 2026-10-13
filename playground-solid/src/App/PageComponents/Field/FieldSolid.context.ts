import { createContext, onCleanup, onMount, untrack, useContext } from "solid-js";

import type {
    FieldDefaultRegistry,
    FieldResetRegistry,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.context";

export type {
    FieldResetRegistry,
    FieldDefaultRegistry,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.context";

const FieldResetContext = createContext<FieldResetRegistry>();

const FieldDefaultContext = createContext<FieldDefaultRegistry>();

export const FieldResetProvider = FieldResetContext.Provider;

export const FieldDefaultProvider = FieldDefaultContext.Provider;

export const useFieldReset = <T>(getValue: () => T, apply: (value: T) => void) => {
    const registry = useContext(FieldResetContext);
    const defaults = useContext(FieldDefaultContext);

    onMount(() => {
        const initial = untrack(getValue);

        if (defaults !== undefined) onCleanup(defaults.report(initial));

        if (registry === undefined) return;

        onCleanup(registry.register(() => apply(initial)));
    });
};
