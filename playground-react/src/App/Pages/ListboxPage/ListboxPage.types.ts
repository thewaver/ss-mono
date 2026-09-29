export type ListboxExampleProps = {
    value: readonly [string | undefined, (value: string | undefined) => void];
};

export type MultiListboxExampleProps = {
    values: readonly [string[], (values: string[]) => void];
};
