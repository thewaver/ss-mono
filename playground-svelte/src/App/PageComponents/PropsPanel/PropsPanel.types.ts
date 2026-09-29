import type { Snippet } from "svelte";

export type PagePropsPanelScope = "global" | "local" | "sample";

export type PagePropsPanelProps = {
    scope: PagePropsPanelScope;
    children?: Snippet;
};
