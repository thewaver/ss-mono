import type { VNodeChild } from "vue";

import type { Count2d, Index2d } from "@thewaver/ss-utils";

export type SVGPatternCellRenderer = (id: string, index: Index2d, cellCount: Count2d, isSplit: boolean) => VNodeChild;

export type SVGPatternTrackedCellRenderer = (id: string, index: Index2d, isSplit: boolean, level: number) => VNodeChild;
