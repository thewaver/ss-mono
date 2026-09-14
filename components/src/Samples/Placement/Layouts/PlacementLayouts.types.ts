import type {
    PlacementLayout,
    PlacementLayoutDefs,
    PlacementLayoutFn,
} from "../../../Abstracts/Placement/Placement.types";

export type SizedLayout = PlacementLayout & { extent: number };

export type SizedLayoutFn = (defs: PlacementLayoutDefs) => SizedLayout;

export type FittedLayoutFn = PlacementLayoutFn;

export type BandDefs = {
    spreadDegrees?: number;
    facingDegrees?: number;
    holeRatio?: number;
    wedgeGapDegrees?: number;
    tiltRatio?: number;
    itemRadiusRatio?: number;
    itemHeightRatio?: number;
    itemMaxWidthRatio?: number;
    computeItemArcs?: () => (number | undefined)[];
};

export type ArcDefs = {
    curveHeightRatio?: number;
    spreadDegrees?: number;
    facingDegrees?: number;
    tiltRatio?: number;
    itemWidthRatio?: number;
    itemHeightRatio?: number;
};

export type HoneycombDefs = {
    perRow?: number;
    gapRatio?: number;
};

export type WhorlDefs = {
    itemStepRatio?: number;
    whorlStepRatio?: number;
};

export type ZigzagDefs = {
    segmentLength?: number;
};

export type CliffDefs = {
    cliffStepRatio?: number;
};

export type PlacementLayoutEntry =
    | { family: "ring"; defs?: BandDefs }
    | { family: "arc"; defs?: ArcDefs }
    | { family: "honeycomb"; defs?: HoneycombDefs }
    | { family: "cliff"; defs?: CliffDefs }
    | { family: "whorl"; defs?: WhorlDefs }
    | { family: "zigzag"; defs?: ZigzagDefs };

export type PlacementLayoutFamily = PlacementLayoutEntry["family"];
