import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type LabelExampleProps = {
    "checked": boolean;
    "onUpdate:checked"?: (isChecked: boolean) => void;
};

export type LabelRadioExampleProps = {
    "value": PlanValue;
    "onUpdate:value"?: (value: PlanValue) => void;
};
