import type { ReactNode } from "react";

export type VariantDefs = {
    key: string;
    name: string;
    readout?: () => string;
    component: () => ReactNode;
};

export type VariantsProps = {
    items: VariantDefs[];
    minColumnWidth?: number;
};
