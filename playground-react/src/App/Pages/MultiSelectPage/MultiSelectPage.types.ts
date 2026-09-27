export type MultiSelectClearableExampleProps = {
    valuesState: readonly [string[], (values: string[]) => void];
    onSelectionChange: (values: string[]) => void;
};
