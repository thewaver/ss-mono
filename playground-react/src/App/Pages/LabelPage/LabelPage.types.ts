export type PlanValue = "free" | "pro";

export type LabelExampleProps = {
    checkedState: readonly [boolean, (isChecked: boolean) => void];
};

export type LabelRadioExampleProps = {
    valueState: readonly [PlanValue, (value: PlanValue) => void];
};
