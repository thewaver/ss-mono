import type { SelectOptionRecord } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    single: "One value",
    multiple: "Several values, in groups",
    horizontalRightToLeft: "Horizontal, right to left",
    glide: "Gliding markers",
};

export const SIZES: SelectOptionRecord<string, never>[] = [
    { value: "XS" },
    { value: "S" },
    { value: "M" },
    { value: "L", isDisabled: true },
    { value: "XL" },
];

export const EXAMPLES_ROOT = "/src/App/Pages/ListboxPage/Examples";
