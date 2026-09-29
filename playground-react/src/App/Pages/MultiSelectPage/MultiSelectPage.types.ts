export type MultiSelectClearableExampleProps = {
    values: readonly [string[], (values: string[]) => void];
    onSelectionChange: (values: string[]) => void;
};
