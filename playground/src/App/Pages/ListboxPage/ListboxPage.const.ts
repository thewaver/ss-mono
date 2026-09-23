import type { SelectOption } from "@thewaver/ss-components";

export const SIZES: SelectOption<string>[] = [
    { value: "XS" },
    { value: "S" },
    { value: "M" },
    { value: "L", isDisabled: true },
    { value: "XL" },
];
