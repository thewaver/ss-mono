export type TrackPlacementDefs = {
    gapRatio?: number;
};

export type DrumPlacementDefs = {
    perspectivePx?: number;
    faceCount?: number;
    faceRatio?: number;
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

export type PaddleWheelPlacementDefs = {
    spanDegrees?: number;
    perspectivePx?: number;
};

export type CarouselPlacementEntry =
    | { family: "track"; defs?: TrackPlacementDefs }
    | { family: "drum"; defs?: DrumPlacementDefs }
    | { family: "cover_flow"; defs?: CoverFlowPlacementDefs }
    | { family: "depth_wave"; defs?: DepthWavePlacementDefs }
    | { family: "cylinder"; defs?: CylinderPlacementDefs }
    | { family: "folders"; defs?: FoldersPlacementDefs }
    | { family: "hinge"; defs?: HingePlacementDefs }
    | { family: "paddle_wheel"; defs?: PaddleWheelPlacementDefs };

export type CarouselPlacementFamily = CarouselPlacementEntry["family"];
