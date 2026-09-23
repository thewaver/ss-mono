import type { Signal } from "solid-js";

export type ListboxExampleProps = {
    valueSignal: Signal<string | undefined>;
};

export type MultiListboxExampleProps = {
    valuesSignal: Signal<string[]>;
};
