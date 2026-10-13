import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

export type LabelExampleProps = {
    checked: readonly [boolean, (isChecked: boolean) => void];
};

export type LabelRadioExampleProps = {
    value: readonly [PlanValue, (value: PlanValue) => void];
};
