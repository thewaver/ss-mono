import { createContext, useContext, useEffect, useState } from "react";

import { useLatest } from "@thewaver/ss-components-react";

export type FieldResetRegistry = {
    register: (reset: () => void) => () => void;
};

export type FieldDefaultRegistry = {
    report: (value: unknown) => () => void;
};

const FieldResetContext = createContext<FieldResetRegistry | undefined>(undefined);

const FieldDefaultContext = createContext<FieldDefaultRegistry | undefined>(undefined);

export const FieldResetProvider = FieldResetContext.Provider;

export const FieldDefaultProvider = FieldDefaultContext.Provider;

export const useFieldReset = <T>(value: T, apply: (value: T) => void) => {
    const registry = useContext(FieldResetContext);
    const defaults = useContext(FieldDefaultContext);

    const [initial] = useState(value);
    const latestApply = useLatest(apply);

    useEffect(() => {
        const stopReporting = defaults?.report(initial);
        const stopRegistering = registry?.register(() => latestApply.current(initial));

        return () => {
            stopRegistering?.();
            stopReporting?.();
        };
    }, []);
};
