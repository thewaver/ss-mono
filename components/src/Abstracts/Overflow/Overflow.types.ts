export type OverflowCollapse = "auto" | "never" | "always";

export type OverflowCutDefs = {
    widths: number[];
    collapses: OverflowCollapse[];
    available: number;
    overflowWidth: number;
    gap: number;
};

export type OverflowCut = {
    shownIndexes: number[];
    collapsedIndexes: number[];
};
