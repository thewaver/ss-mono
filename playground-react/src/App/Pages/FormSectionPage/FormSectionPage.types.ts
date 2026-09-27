export type FormSectionTextState = readonly [string, (value: string) => void];

export type FormSectionsExampleProps = {
    emailState: FormSectionTextState;
    passwordState: FormSectionTextState;
    confirmState: FormSectionTextState;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormSectionNestedExampleProps = {
    streetState: FormSectionTextState;
    cardState: FormSectionTextState;
    onSubmit: () => void;
};
