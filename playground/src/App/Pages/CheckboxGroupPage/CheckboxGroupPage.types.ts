import type { Signal } from "solid-js";

export type Topping = {
    value: string;
    label: string;
    isSoldOut?: boolean;
};

export type CheckboxGroupExampleProps = {
    valueSignal: Signal<string[]>;
};
