export type FieldResetRegistry = {
    register: (reset: () => void) => () => void;
};

export type FieldDefaultRegistry = {
    report: (value: unknown) => () => void;
};
