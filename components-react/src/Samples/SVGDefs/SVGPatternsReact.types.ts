import type { ReactNode } from "react";

import type { Count2d, Index2d } from "@thewaver/ss-utils";

export type SVGPatternCellRenderer = (id: string, index: Index2d, cellCount: Count2d, isSplit: boolean) => ReactNode;

export type SVGPatternTrackedCellRenderer = (id: string, index: Index2d, isSplit: boolean, level: number) => ReactNode;
