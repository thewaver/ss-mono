import type { JSX } from "solid-js";

import type { Count2d, Index2d } from "@thewaver/ss-utils";

export type SVGPatternCellRenderer = (id: string, index: Index2d, cellCount: Count2d, isSplit: boolean) => JSX.Element;

export type SVGPatternTrackedCellRenderer = (
    id: string,
    index: Index2d,
    isSplit: boolean,
    getLevel: () => number,
) => JSX.Element;
