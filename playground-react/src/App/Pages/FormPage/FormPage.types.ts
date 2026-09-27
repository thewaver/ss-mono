export type FormExampleProps = {
    emailState: readonly [string, (value: string) => void];
    passwordState: readonly [string, (value: string) => void];
    termsState: readonly [boolean, (value: boolean) => void];
    onSubmit: () => void;
    onReset: () => void;
};

export type FormFocusExampleProps = {
    planState: readonly [string | undefined, (value: string | undefined) => void];
    topicsState: readonly [string[], (values: string[]) => void];
    onSubmit: () => void;
    onReset: () => void;
};
