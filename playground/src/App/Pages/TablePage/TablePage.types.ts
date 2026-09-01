import type { Signal } from "solid-js";

import type { TableSort } from "@thewaver/ss-components";

export type Part = {
    sku: string;
    name: string;
    category: string;
    stock: number;
    pricePence: number;
};

export type PartColumnDefs = {
    isResizable?: boolean;
    isReorderable?: boolean;
};

export type TableExampleProps = {
    sortSignal: Signal<TableSort | undefined>;
    selectionSignal: Signal<Part[]>;
};
