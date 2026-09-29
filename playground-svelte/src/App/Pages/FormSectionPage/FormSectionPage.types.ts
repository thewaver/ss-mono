import type { ValuePair } from "@thewaver/ss-components-svelte";

export type FormSectionTextState = ValuePair<string>;

export type FormSectionsExampleProps = {
    email: string;
    password: string;
    confirm: string;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormSectionNestedExampleProps = {
    street: string;
    card: string;
    onSubmit: () => void;
};
