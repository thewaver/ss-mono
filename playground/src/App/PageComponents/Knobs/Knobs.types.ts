import type { Accessor } from "solid-js";

import type { SampleKnob } from "@thewaver/ss-components";

export type PageKnobsProps = {
    knobs: Accessor<Record<string, SampleKnob | undefined>>;
    defaults: Accessor<Record<string, unknown>>;
    values: Accessor<Record<string, unknown>>;
    width?: Accessor<number>;
    onInput: (key: string, value: number | boolean) => void;
};
