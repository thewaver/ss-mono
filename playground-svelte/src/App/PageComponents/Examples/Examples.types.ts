import type { Snippet } from "svelte";

export type ExampleDefs = {
    key: string;
    name: string;
    span?: number;
    path?: string;
    readout?: () => string;
    component: Snippet;
};

export type ExamplesProps = {
    items: ExampleDefs[];
    layout?: "grid" | "flow";
    minColumnWidth?: number;
};

export type ExampleProps = {
    example: ExampleDefs;
    onViewSource: () => void;
};
