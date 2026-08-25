import type { JSX } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type ExampleDefs = {
    key: string;
    name: string;
    span?: number;
    path?: string;
    readout?: () => string;
    component: () => JSX.Element;
};

export type ExamplesProps = AccessorProps<{
    items: ExampleDefs[];
    layout?: "grid" | "flow";
    minColumnWidth?: number;
}>;
