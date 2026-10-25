import type { TreeFalloff } from "./TreeFalloffs.types";

export type BaseTreeDisabledDocsExampleValues = {
    isReachable: boolean;
};

export type BaseTreeLinksDocsExampleValues = {
    hasLinkComponent: boolean;
};

export type BaseTreeVirtualizedDocsExampleValues = {
    count: number;
};

export type BaseTreeLeaningDocsExampleValues = {
    falloff: TreeFalloff;
};

export type RadialSpan = { from: number; to: number; depth: number };
