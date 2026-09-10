export type SampleNumberKnob = {
    kind: "number";
    label: string;
    min: number;
    max: number;
    step: number;
};

export type SampleCheckKnob = {
    kind: "check";
    label: string;
};

export type SampleKnob = SampleNumberKnob | SampleCheckKnob;

export type SampleKnobFor<T> = T extends number ? SampleNumberKnob : T extends boolean ? SampleCheckKnob : never;

export type SampleKnobs<T> = { [K in keyof T]?: SampleKnobFor<NonNullable<T[K]>> };
