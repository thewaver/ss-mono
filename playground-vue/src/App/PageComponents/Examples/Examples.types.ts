import type { VNodeChild } from "vue";

export type ExampleDefs = {
    key: string;
    name: string;
    span?: number;
    path?: string;
    readout?: () => string;
};

export type ExamplesProps = {
    items: ExampleDefs[];
    layout?: "grid" | "flow";
    minColumnWidth?: number;
};

export type ExamplesSlots = Record<string, (() => VNodeChild) | undefined>;

export type ExampleProps = {
    example: ExampleDefs;
    onViewSource: () => void;
};

export type ExampleSlots = {
    default?: () => VNodeChild;
};
