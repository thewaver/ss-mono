export type FormExampleProps = {
    email: readonly [string, (value: string) => void];
    password: readonly [string, (value: string) => void];
    terms: readonly [boolean, (value: boolean) => void];
    onSubmit: () => void;
    onReset: () => void;
};

export type FormFocusExampleProps = {
    plan: readonly [string | undefined, (value: string | undefined) => void];
    topics: readonly [string[], (values: string[]) => void];
    onSubmit: () => void;
    onReset: () => void;
};
