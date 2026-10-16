import { createContext, useContext, useEffect, useState } from "react";

import { useLatest } from "@thewaver/ss-components-react";
import type {
    FieldDefaultRegistry,
    FieldResetRegistry,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.context";

export type {
    FieldResetRegistry,
    FieldDefaultRegistry,
} from "@thewaver/ss-playground/App/PageComponents/Field/Field.context";

const FieldResetContext = createContext<FieldResetRegistry | undefined>(undefined);

const FieldDefaultContext = createContext<FieldDefaultRegistry | undefined>(undefined);

export const FieldResetProvider = FieldResetContext.Provider;

export const FieldDefaultProvider = FieldDefaultContext.Provider;

export const useFieldReset = <T>(value: T, apply: (value: T) => void, resetValue?: T) => {
    const registry = useContext(FieldResetContext);
    const defaults = useContext(FieldDefaultContext);

    const [initial] = useState(value);
    const latestApply = useLatest(apply);
    const latestResetValue = useLatest(resetValue);

    useEffect(() => {
        const stopReporting = defaults?.report(initial);
        const stopRegistering = registry?.register(() => latestApply.current(latestResetValue.current ?? initial));

        return () => {
            stopRegistering?.();
            stopReporting?.();
        };
    }, []);
};
