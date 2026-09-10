import type { JSX } from "solid-js";

import type { SVGPatternCellCount, SVGPatternCellIndex } from "./SVGPatternLayouts.types";

export type SVGPatternCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    cellCount: SVGPatternCellCount,
    isSplit: boolean,
) => JSX.Element;
