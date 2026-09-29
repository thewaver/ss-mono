import type { Signal } from "solid-js";

export type ListboxExampleProps = {
    value: Signal<string | undefined>;
};

export type MultiListboxExampleProps = {
    values: Signal<string[]>;
};
