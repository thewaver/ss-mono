export type WallsLayoutDefs = {
    minSkipCount?: number;
    maxSkipCount?: number;
    seed?: number;
    heightRatio?: number;
    aspectRatio?: number;
    farWidthRatio?: number;
    nearAngleDegrees?: number;
    farAngleDegrees?: number;
    perspectivePx?: number;
    visibleCards?: number;
    viewDistance?: number;
};

export type TubeLayoutDefs = {
    sides?: number;
    minSkipCount?: number;
    maxSkipCount?: number;
    seed?: number;
    radiusRatio?: number;
    farWidthRatio?: number;
    depthRatio?: number;
    tiltDegrees?: number;
    twistDegrees?: number;
    spinDegrees?: number;
    perspectivePx?: number;
    visibleRings?: number;
    viewRings?: number;
};

export type CorridorLayoutEntry =
    { family: "walls"; defs?: WallsLayoutDefs } | { family: "tube"; defs?: TubeLayoutDefs };

export type CorridorLayoutFamily = CorridorLayoutEntry["family"];
