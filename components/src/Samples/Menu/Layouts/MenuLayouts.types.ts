import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";

export type MenuLayoutFn = PlacementLayoutFn;

export type ArcDefs = {
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

export type FanDefs = {
    itemWidthPx?: number;
    itemHeightPx?: number;
    stepDegrees?: number;
    maxSpreadDegrees?: number;
    gapPx?: number;
    tiltRatio?: number;
};
