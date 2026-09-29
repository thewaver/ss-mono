export type FormSectionTextState = readonly [string, (value: string) => void];

export type FormSectionsExampleProps = {
    email: FormSectionTextState;
    password: FormSectionTextState;
    confirm: FormSectionTextState;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormSectionNestedExampleProps = {
    street: FormSectionTextState;
    card: FormSectionTextState;
    onSubmit: () => void;
};
