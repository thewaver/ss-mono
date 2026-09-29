import type { VNodeChild } from "vue";

import type { SVGPatternCellCount, SVGPatternCellIndex } from "@thewaver/ss-components";

export type SVGPatternCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    cellCount: SVGPatternCellCount,
    isSplit: boolean,
) => VNodeChild;
