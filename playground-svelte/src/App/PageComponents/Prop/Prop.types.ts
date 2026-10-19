import type { Snippet } from "svelte";

export type PagePropProps = {
    itemKey: string;
    label: string;
    hint: string;
    controls: string;
    defaultValue?: unknown;
    children?: Snippet;
};
