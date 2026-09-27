import type { Knob } from "@thewaver/ss-playground-core/App/PageComponents/Knobs/KnobDefs.types";

export type {
    NumberKnob,
    CheckKnob,
    Knob,
    KnobFor,
    Knobs,
} from "@thewaver/ss-playground-core/App/PageComponents/Knobs/KnobDefs.types";

export type PageKnobsProps = {
    knobs: Record<string, Knob | undefined>;
    defaults: Record<string, unknown>;
    values: Record<string, unknown>;
    width?: number;
    onInput: (key: string, value: number | boolean) => void;
};
