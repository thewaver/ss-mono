import type { ReactNode } from "react";

import type { Size2d } from "@thewaver/ss-utils";

export type PagePaintAreaGroupCell = {
    index: number;
    groupElement: HTMLElement | undefined;
    groupSize: Size2d;
};

export type PagePaintAreaGroupProps = {
    className: string;
    cellCount: number;
    renderCell: (cell: PagePaintAreaGroupCell) => ReactNode;
};
