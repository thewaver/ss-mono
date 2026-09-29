import type { CheckboxGroupEntry } from "@thewaver/ss-components";

export type CheckboxGroupReactContextType = {
    computeIsChecked: (value: unknown) => boolean;
    setIsChecked: (value: unknown, isChecked: boolean) => void;
    register: (entry: CheckboxGroupEntry) => () => void;
};
