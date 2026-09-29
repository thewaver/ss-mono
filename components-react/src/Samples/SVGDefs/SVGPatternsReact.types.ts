import type { ReactNode } from "react";

import type { SVGPatternCellCount, SVGPatternCellIndex } from "@thewaver/ss-components";

export type SVGPatternCellRenderer = (
    id: string,
    index: SVGPatternCellIndex,
    cellCount: SVGPatternCellCount,
    isSplit: boolean,
) => ReactNode;
