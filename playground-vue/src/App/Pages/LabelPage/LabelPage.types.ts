export type PlanValue = "free" | "pro";

export type LabelExampleProps = {
    "checked": boolean;
    "onUpdate:checked"?: (isChecked: boolean) => void;
};

export type LabelRadioExampleProps = {
    "value": PlanValue;
    "onUpdate:value"?: (value: PlanValue) => void;
};
