export type TrackPlacementDefs = {
    gapRatio?: number;
};

export type DrumPlacementDefs = {
    perspectivePx?: number;
};

export type CoverFlowPlacementDefs = {
    spacingRatio?: number;
    gapRatio?: number;
    angleDegrees?: number;
    depthPx?: number;
    perspectivePx?: number;
    visibleDistance?: number;
};

export type DepthWavePlacementDefs = {
    spacingRatio?: number;
    depthPx?: number;
    tiltDegrees?: number;
    perspectivePx?: number;
    visibleDistance?: number;
};

export type CylinderPlacementDefs = {
    stepDegrees?: number;
    perspectivePx?: number;
};

export type FoldersPlacementDefs = {
    offsetRatio?: number;
    scaleStep?: number;
    visibleDistance?: number;
};

export type HingePlacementDefs = {
    offsetRatio?: number;
    depthPx?: number;
    perspectivePx?: number;
    visibleDistance?: number;
};

export type CarouselPlacementEntry =
    | { family: "track"; defs?: TrackPlacementDefs }
    | { family: "drum"; defs?: DrumPlacementDefs }
    | { family: "coverFlow"; defs?: CoverFlowPlacementDefs }
    | { family: "depthWave"; defs?: DepthWavePlacementDefs }
    | { family: "cylinder"; defs?: CylinderPlacementDefs }
    | { family: "folders"; defs?: FoldersPlacementDefs }
    | { family: "hinge"; defs?: HingePlacementDefs };

export type CarouselPlacementFamily = CarouselPlacementEntry["family"];
