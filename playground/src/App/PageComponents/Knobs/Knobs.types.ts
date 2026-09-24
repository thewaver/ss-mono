import type { Accessor } from "solid-js";

export type PageKnobsProps = {
    knobs: Accessor<Record<string, Knob | undefined>>;
    defaults: Accessor<Record<string, unknown>>;
    values: Accessor<Record<string, unknown>>;
    width?: Accessor<number>;
    onInput: (key: string, value: number | boolean) => void;
};

export type NumberKnob = {
    kind: "number";
    label: string;
    hint: string;
    min: number;
    max: number;
    step: number;
};

export type CheckKnob = {
    kind: "check";
    label: string;
    hint: string;
};

export type Knob = NumberKnob | CheckKnob;

export type KnobFor<T> = T extends number ? NumberKnob : T extends boolean ? CheckKnob : never;

export type Knobs<T> = { [K in keyof T]?: KnobFor<NonNullable<T[K]>> };
