import type { Signal } from "solid-js";

import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type LabelExampleProps = {
    checked: Signal<boolean>;
};

export type LabelRadioExampleProps = {
    value: Signal<PlanValue>;
};
