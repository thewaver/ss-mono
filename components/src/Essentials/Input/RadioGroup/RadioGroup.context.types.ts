import type { PlacementRect } from "../../../Abstracts/Placement/Placement.types";

export type RadioGroupEntry = {
    getElementRef: () => HTMLElement | undefined;
    getIsDisabled: () => boolean;
    getIsReachable: () => boolean;
    getValue: () => unknown;
};

export type RadioGroupContextType = {
    getName: () => string;
    getValue: () => unknown;
    setValue: (value: unknown) => void;
    computeIsTabbable: (value: unknown) => boolean;
    computePlacement: (entry: RadioGroupEntry) => PlacementRect | undefined;
    register: (entry: RadioGroupEntry) => void;
};
