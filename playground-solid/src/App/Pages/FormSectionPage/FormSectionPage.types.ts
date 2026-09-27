import type { Signal } from "solid-js";

export type FormSectionsExampleProps = {
    emailSignal: Signal<string>;
    passwordSignal: Signal<string>;
    confirmSignal: Signal<string>;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormSectionNestedExampleProps = {
    streetSignal: Signal<string>;
    cardSignal: Signal<string>;
    onSubmit: () => void;
};
