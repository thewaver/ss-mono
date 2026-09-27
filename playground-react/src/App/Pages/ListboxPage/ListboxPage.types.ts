export type ListboxExampleProps = {
    valueState: readonly [string | undefined, (value: string | undefined) => void];
};

export type MultiListboxExampleProps = {
    valuesState: readonly [string[], (values: string[]) => void];
};
