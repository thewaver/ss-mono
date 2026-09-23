import type { Signal } from "solid-js";

export type MultiSelectClearableExampleProps = {
    valuesSignal: Signal<string[]>;
    onSelectionChange: (values: string[]) => void;
};
