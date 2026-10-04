import type {
    CoverFlowPlacementDefs,
    CylinderPlacementDefs,
    DepthWavePlacementDefs,
    DrumPlacementDefs,
    FoldersPlacementDefs,
    HingePlacementDefs,
    PaddleWheelPlacementDefs,
    TrackPlacementDefs,
} from "./CarouselPlacements.types";

export namespace CarouselPlacementDefaults {
    export const TRACK_DEFAULTS: Required<TrackPlacementDefs> = {
        gapRatio: 0,
    };

    export const DRUM_DEFAULTS: Required<DrumPlacementDefs> = {
        perspectivePx: 1000,
    };

    export const COVER_FLOW_DEFAULTS: Required<CoverFlowPlacementDefs> = {
        spacingRatio: 0.18,
        gapRatio: 0.28,
        angleDegrees: 55,
        depthPx: 180,
        perspectivePx: 800,
        visibleDistance: 4,
    };

    export const DEPTH_WAVE_DEFAULTS: Required<DepthWavePlacementDefs> = {
        spacingRatio: 0.6,
        depthPx: 140,
        tiltDegrees: 12,
        perspectivePx: 900,
        visibleDistance: 4,
    };

    export const CYLINDER_DEFAULTS: Required<CylinderPlacementDefs> = {
        stepDegrees: 28,
        perspectivePx: 900,
    };

    export const FOLDERS_DEFAULTS: Required<FoldersPlacementDefs> = {
        offsetRatio: 0.1,
        scaleStep: 0.06,
        visibleDistance: 4,
    };

    export const HINGE_DEFAULTS: Required<HingePlacementDefs> = {
        offsetRatio: 0.06,
        depthPx: 30,
        perspectivePx: 900,
        visibleDistance: 4,
    };

    export const PADDLE_WHEEL_DEFAULTS: Required<PaddleWheelPlacementDefs> = {
        spanDegrees: 360,
        perspectivePx: 1000,
    };

    export const DEFAULTS_BY_FAMILY = {
        track: TRACK_DEFAULTS,
        drum: DRUM_DEFAULTS,
        coverFlow: COVER_FLOW_DEFAULTS,
        depthWave: DEPTH_WAVE_DEFAULTS,
        cylinder: CYLINDER_DEFAULTS,
        folders: FOLDERS_DEFAULTS,
        hinge: HINGE_DEFAULTS,
        paddleWheel: PADDLE_WHEEL_DEFAULTS,
    };
}
