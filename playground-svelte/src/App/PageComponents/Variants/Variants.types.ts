import type { Snippet } from "svelte";

export type VariantDefs = {
    key: string;
    name: string;
    readout?: () => string;
    component: Snippet;
};

export type VariantsProps = {
    items: VariantDefs[];
    minColumnWidth?: number;
};
