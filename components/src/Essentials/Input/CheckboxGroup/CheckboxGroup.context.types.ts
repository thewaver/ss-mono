export type CheckboxGroupEntry = {
    getValue: () => unknown;
    getIsDisabled: () => boolean;
};

export type CheckboxGroupContextType = {
    computeIsChecked: (value: unknown) => boolean;
    setIsChecked: (value: unknown, isChecked: boolean) => void;
    register: (entry: CheckboxGroupEntry) => void;
};
