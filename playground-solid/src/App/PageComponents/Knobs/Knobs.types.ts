import type { Accessor } from "solid-js";

import type { Knob } from "@thewaver/ss-playground-core/App/PageComponents/Knobs/KnobDefs.types";

export type {
    NumberKnob,
    CheckKnob,
    Knob,
    KnobFor,
    Knobs,
} from "@thewaver/ss-playground-core/App/PageComponents/Knobs/KnobDefs.types";

export type PageKnobsProps = {
    knobs: Accessor<Record<string, Knob | undefined>>;
    defaults: Accessor<Record<string, unknown>>;
    values: Accessor<Record<string, unknown>>;
    width?: Accessor<number>;
    onInput: (key: string, value: number | boolean) => void;
};
