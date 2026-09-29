import type { Snippet } from "svelte";

export type PageMeasureBoxProps = {
    width?: number;
    height?: number;
    padding?: number;
    isFilling?: boolean;
    children?: Snippet;
};
