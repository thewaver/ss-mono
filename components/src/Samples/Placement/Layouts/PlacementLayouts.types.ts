import type {
    PlacementLayout,
    PlacementLayoutDefs,
    PlacementLayoutFn,
} from "../../../Abstracts/Placement/Placement.types";

export type SizedLayout = PlacementLayout & { width: number };

export type SizedLayoutFn = (defs: PlacementLayoutDefs) => SizedLayout;

export type FittedLayoutFn = PlacementLayoutFn;

export type BandDefs = {
    holeRadiusPx?: number;
    bandWidthPx?: number;
    levelGapPx?: number;
    wedgeGapDegrees?: number;
    wedgeArcPx?: number;
    centreRadiusPx?: number;
    hasCentreItem?: boolean;
    labelRadiusRatio?: number;
    labelHeightRatio?: number;
    labelMaxWidthRatio?: number;
    computeItemArcs?: (path: number[]) => (number | undefined)[];
};

export type ArcDefs = {
    widthPx?: number;
    heightPx?: number;
    spreadDegrees?: number;
    itemWidthPx?: number;
    itemHeightPx?: number;
};

export type FanDefs = {
    itemWidthPx?: number;
    itemHeightPx?: number;
    stepDegrees?: number;
    maxSpreadDegrees?: number;
    gapPx?: number;
    tiltRatio?: number;
};

export type HoneycombDefs = {
    cellWidthPx?: number;
    perRow?: number;
    gapPx?: number;
};

export type RadialTreeDefs = {
    innerRadiusPx?: number;
    ringGapPx?: number;
    itemWidthPx?: number;
    itemHeightPx?: number;
    spreadDegrees?: number;
};
