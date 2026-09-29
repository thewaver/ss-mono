import type { PlacementRect, RadioGroupEntry } from "@thewaver/ss-components";

export type RadioGroupVueContextType = {
    getName: () => string;
    getValue: () => unknown;
    setValue: (value: unknown) => void;
    computeIsTabbable: (value: unknown) => boolean;
    computePlacement: (entry: RadioGroupEntry) => PlacementRect | undefined;
    register: (entry: RadioGroupEntry) => () => void;
};
