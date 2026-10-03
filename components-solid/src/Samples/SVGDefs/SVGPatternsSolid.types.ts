import type { JSX } from "solid-js";

import type { SVGPatternCellCount, SVGPatternCellIndex } from "@thewaver/ss-components";

export type SVGPatternCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    cellCount: SVGPatternCellCount,
    isSplit: boolean,
) => JSX.Element;

export type SVGPatternTrackedCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    isSplit: boolean,
    getLevel: () => number,
) => JSX.Element;
