export type WallsLayoutDefs = {
    minSkipCount?: number;
    maxSkipCount?: number;
    seed?: number;
    heightRatio?: number;
    aspectRatio?: number;
    farWidthRatio?: number;
    nearAngleDegrees?: number;
    farAngleDegrees?: number;
    staggerRatio?: number;
    perspectivePx?: number;
    visibleCards?: number;
    focusDistance?: number;
};

export type TubeLayoutDefs = {
    sides?: number;
    minSkipCount?: number;
    maxSkipCount?: number;
    seed?: number;
    nearWidthRatio?: number;
    farWidthRatio?: number;
    depthRatio?: number;
    tiltDegrees?: number;
    twistDegrees?: number;
    spinDegrees?: number;
    perspectivePx?: number;
    visibleRings?: number;
    focusRings?: number;
};

export type TubeCornerDefs = {
    sides: number;
    nearRadius: number;
    farRadius: number;
    nearDepth: number;
    farDepth: number;
    nearRollDegrees: number;
    farRollDegrees: number;
    leanDegrees: number;
    perspectivePx: number;
};

export type CorridorLayoutEntry =
    { family: "walls"; defs?: WallsLayoutDefs } | { family: "tube"; defs?: TubeLayoutDefs };

export type CorridorLayoutFamily = CorridorLayoutEntry["family"];
