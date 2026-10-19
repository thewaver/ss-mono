export const toCheckValue = (defaultValue: unknown, isChecked: boolean) =>
    typeof defaultValue === "number" ? Number(isChecked) : isChecked;
