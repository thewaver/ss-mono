import type { Signal } from "solid-js";

export type FormSectionsExampleProps = {
    email: Signal<string>;
    password: Signal<string>;
    confirm: Signal<string>;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormSectionNestedExampleProps = {
    street: Signal<string>;
    card: Signal<string>;
    onSubmit: () => void;
};
