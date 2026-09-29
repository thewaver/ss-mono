import type { ReactNode } from "react";

export type ExampleDefs = {
    key: string;
    name: string;
    span?: number;
    path?: string;
    readout?: () => string;
    component: () => ReactNode;
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
