import type { Signal } from "solid-js";

export type FormExampleProps = {
    email: Signal<string>;
    password: Signal<string>;
    terms: Signal<boolean>;
    onSubmit: () => void;
    onReset: () => void;
};

export type FormFocusExampleProps = {
    plan: Signal<string | undefined>;
    topics: Signal<string[]>;
    onSubmit: () => void;
    onReset: () => void;
};
