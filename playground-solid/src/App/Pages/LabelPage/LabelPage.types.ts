import type { Signal } from "solid-js";

export type PlanValue = "free" | "pro";

export type LabelExampleProps = {
    checked: Signal<boolean>;
};

export type LabelRadioExampleProps = {
    value: Signal<PlanValue>;
};
