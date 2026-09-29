export type PlanValue = "free" | "pro";

export type LabelExampleProps = {
    checked: readonly [boolean, (isChecked: boolean) => void];
};

export type LabelRadioExampleProps = {
    value: readonly [PlanValue, (value: PlanValue) => void];
};
