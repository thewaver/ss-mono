import type { SelectOptionRecord } from "@thewaver/ss-components";

export const SIZES: SelectOptionRecord<string, never>[] = [
    { value: "XS" },
    { value: "S" },
    { value: "M" },
    { value: "L", isDisabled: true },
    { value: "XL" },
];

export const DOCS_ROOT = "/src/App/Pages/ListboxPage/Docs";
