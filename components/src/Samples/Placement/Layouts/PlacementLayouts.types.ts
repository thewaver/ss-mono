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
    holeRadius?: number;
    bandWidth?: number;
    levelGap?: number;
    wedgeGapDegrees?: number;
    wedgeArc?: number;
    tiltRatio?: number;
    centreRadius?: number;
    hasCentreItem?: boolean;
    labelRadiusRatio?: number;
    labelHeightRatio?: number;
    labelMaxWidthRatio?: number;
    computeItemArcs?: (path: number[]) => (number | undefined)[];
};

export type ArcDefs = {
    width?: number;
    height?: number;
    spreadDegrees?: number;
    facingDegrees?: number;
    tiltRatio?: number;
    itemWidth?: number;
    itemHeight?: number;
};

export type HoneycombDefs = {
    cellWidth?: number;
    perRow?: number;
    gap?: number;
};

export type WhorlDefs = {
    itemSpacing?: number;
    whorlSpacing?: number;
};

export type ZigzagDefs = {
    segmentLength?: number;
};

export type PodiumDefs = Record<string, never>;

export type PlacementLayoutEntry =
    | { family: "ring"; defs?: BandDefs }
    | { family: "arc"; defs?: ArcDefs }
    | { family: "honeycomb"; defs?: HoneycombDefs }
    | { family: "podiumLozenge"; defs?: PodiumDefs }
    | { family: "whorl"; defs?: WhorlDefs }
    | { family: "zigzag"; defs?: ZigzagDefs };

export type PlacementLayoutFamily = PlacementLayoutEntry["family"];
