import type { JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

export type PagePaintAreaGroupCell = {
    index: number;
    getGroupRef: () => HTMLElement | undefined;
    getGroupSize: () => Size2d;
};

export type PagePaintAreaGroupProps = {
    class: string;
    cellCount: number;
    renderCell: (cell: PagePaintAreaGroupCell) => JSX.Element;
};
