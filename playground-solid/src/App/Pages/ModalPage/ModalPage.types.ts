import type { Signal } from "solid-js";

export type ModalExampleProps = {
    visibility: Signal<boolean>;
};

export type ModalDestructiveExampleProps = ModalExampleProps & {
    onDecide: (outcome: string) => void;
};

export type ModalLayeredExampleProps = ModalExampleProps & {
    value: Signal<string | undefined>;
};
