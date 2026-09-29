import type { Snippet } from "svelte";

export type PagePropProps = {
    itemKey: string;
    label: string;
    hint: string;
    defaultValue?: unknown;
    children?: Snippet;
};
