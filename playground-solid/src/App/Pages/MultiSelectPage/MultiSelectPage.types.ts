import type { Signal } from "solid-js";

export type MultiSelectClearableExampleProps = {
    values: Signal<string[]>;
    onSelectionChange: (values: string[]) => void;
};
