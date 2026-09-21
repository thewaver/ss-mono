import type { Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { SVGAnimationDefs } from "../../Abstracts/SVG/Defs/Animation/SVGAnimationDefs.types";
import type { SVGDefs } from "../../Abstracts/SVG/Defs/SVGDefs.types";

export type SVGDefsColors = { [K in "primary" | "secondary" | "tertiary" | "background"]: string };

export type CycleColorKey = "primary" | "secondary" | "tertiary";

export type SVGDefsBaseElementDefs = {
    getSize: () => Size2d;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type IterationConfig = {
    computeDefs: (animationDurationMs: number) => Pick<SVGAnimationDefs, "animationIterationPatterns">;
};

export type PatternElementDefs = SVGAnimationDefs &
    SVGDefsBaseElementDefs & {
        cellSize: Size2d;
    };

export type PatternConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: PatternElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientElementDefs = SVGAnimationDefs & SVGDefsBaseElementDefs;

export type GradientCycleOpts = { cycles?: boolean };

export type GradientStepsOpts = { steps?: number };

export type GradientGlowOpts = { glowScale?: number };

export type GradientTrailOpts = { trailAlpha?: number; trailDecay?: number };

export type GradientFalloffOpts = {
    coreStop?: number;
    coreAlpha?: number;
    falloffStop?: number;
    falloffAlpha?: number;
};

export type GradientCircularOpts = { circular?: boolean };

export type GradientCyclePeriodOpts = { cycleMs?: number };

export type GradientColorAgeOpts = GradientCyclePeriodOpts & { ageColorSpan?: number };

export type GradientSmearOpts = { smearMax?: number; smearSmoothing?: number; smearFullStepRatio?: number };

export type GradientSweepOpts = { sweepArc?: number };

export type GradientSpotTrailOpts = GradientCircularOpts &
    GradientCycleGlowOpts &
    GradientTrailOpts &
    GradientFalloffOpts &
    GradientColorAgeOpts;

export type GradientHandTrailOpts = GradientCycleOpts & GradientTrailOpts & GradientColorAgeOpts & GradientSweepOpts;

export type GradientHandOpts = GradientSweepOpts & { peakAlpha?: number };

export type GradientBandOpts = {
    coreStop?: number;
    coreAlpha?: number;
    falloffSpread?: number;
    falloffAlpha?: number;
    bandTravel?: number;
    bandAngle?: number;
};

export type GradientSpotOpts = GradientCircularOpts & GradientGlowOpts & GradientFalloffOpts;

export type GradientRippleOpts = {
    sourceScale?: number;
    sourceStop?: number;
    sourceAlpha?: number;
    rippleCount?: number;
    rippleSpacingRatio?: number;
    rippleStartScale?: number;
    rippleEndScale?: number;
    rippleAlpha?: number;
    rippleDecay?: number;
    crestStop?: number;
    crestSpreadStart?: number;
    crestSpreadEnd?: number;
};

export type GradientRippleSampleOpts = GradientCircularOpts &
    GradientCycleOpts &
    GradientCyclePeriodOpts &
    GradientRippleOpts;

export type GradientFlareOpts = GradientCircularOpts &
    GradientGlowOpts &
    GradientFalloffOpts & {
        ghostSaturation?: number;
        ghostLuminosity?: number;
        ghostNearGrowth?: number;
        ghostFarGrowth?: number;
    };

export type GradientSmearSampleOpts = GradientCircularOpts &
    GradientCycleGlowOpts &
    GradientTrailOpts &
    GradientFalloffOpts &
    GradientColorAgeOpts &
    GradientSmearOpts;

export type GradientCycleGlowOpts = GradientCycleOpts & GradientGlowOpts;

export type GradientCycleStepsOpts = GradientCycleOpts & GradientStepsOpts;

export type GradientBandedCycleOpts = GradientCycleOpts & { banded?: boolean; bands?: number };

export type TimedGradientConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TimedGradientElementDefs,
    ) => SVGDefs[];
};

export type TrackedGradientElementDefs = SVGDefsBaseElementDefs;

export type TrackedGradientConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TrackedGradientElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientFactory<T = void> = T extends void
    ? () => TimedGradientConfig
    : (opts?: T) => TimedGradientConfig;

export type TrackedGradientFactory<T = void> = T extends void
    ? () => TrackedGradientConfig
    : (opts?: T) => TrackedGradientConfig;

export type TimedGradientEntry =
    | { family: "elastic_circle_1"; defs?: GradientCycleOpts }
    | { family: "elastic_drip_1"; defs?: GradientCycleOpts }
    | { family: "elastic_inter_semicircle_1"; defs?: GradientCycleOpts }
    | { family: "elastic_semicircle_1"; defs?: GradientCycleOpts }
    | { family: "fill_2c" }
    | { family: "fill_3c" }
    | { family: "fill_diag_2v2c" }
    | { family: "flow_2"; defs?: GradientBandedCycleOpts }
    | { family: "flow_3"; defs?: GradientBandedCycleOpts }
    | { family: "flow_diag_2"; defs?: GradientBandedCycleOpts }
    | { family: "flow_diag_3"; defs?: GradientBandedCycleOpts }
    | { family: "merge_1v1"; defs?: GradientCycleOpts }
    | { family: "merge_diag_1v1"; defs?: GradientCycleOpts }
    | { family: "merge_diag_async_4" }
    | { family: "orbit_1"; defs?: GradientCycleStepsOpts }
    | { family: "orbit_1v1"; defs?: GradientCycleStepsOpts }
    | { family: "orbit_async_2v1"; defs?: GradientStepsOpts }
    | { family: "orbit_async_3"; defs?: GradientStepsOpts }
    | { family: "scan_1"; defs?: GradientCycleOpts }
    | { family: "scan_1v1"; defs?: GradientCycleOpts }
    | { family: "scan_diag_1"; defs?: GradientCycleOpts }
    | { family: "scan_diag_1v1"; defs?: GradientCycleOpts }
    | { family: "snake_1"; defs?: GradientCycleStepsOpts }
    | { family: "snake_1v1"; defs?: GradientCycleStepsOpts }
    | { family: "snake_2"; defs?: GradientCycleStepsOpts }
    | { family: "snake_4"; defs?: GradientCycleStepsOpts }
    | { family: "snake_async_3"; defs?: GradientStepsOpts }
    | { family: "snake_inter_2"; defs?: GradientCycleStepsOpts }
    | { family: "sweep_1"; defs?: GradientCycleOpts }
    | { family: "sweep_1v1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_1v1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_async_4"; defs?: GradientCycleOpts };

export type TimedGradientFamily = TimedGradientEntry["family"];

export type TrackedGradientEntry =
    | { family: "band_1"; defs?: GradientBandOpts }
    | { family: "band_1v1"; defs?: GradientBandOpts }
    | { family: "band_diag_1"; defs?: GradientBandOpts }
    | { family: "hand_1"; defs?: GradientHandOpts }
    | { family: "hand_trail_1"; defs?: GradientHandTrailOpts }
    | { family: "hand_trail_2"; defs?: GradientHandTrailOpts }
    | { family: "hand_trail_3"; defs?: GradientHandTrailOpts }
    | { family: "spot_1"; defs?: GradientSpotOpts }
    | { family: "spot_flare_2"; defs?: GradientFlareOpts }
    | { family: "spot_flare_3"; defs?: GradientFlareOpts }
    | { family: "spot_ripple_1"; defs?: GradientRippleSampleOpts }
    | { family: "spot_ripple_2"; defs?: GradientRippleSampleOpts }
    | { family: "spot_ripple_3"; defs?: GradientRippleSampleOpts }
    | { family: "spot_smear_1"; defs?: GradientSmearSampleOpts }
    | { family: "spot_smear_2"; defs?: GradientSmearSampleOpts }
    | { family: "spot_smear_3"; defs?: GradientSmearSampleOpts }
    | { family: "spot_trail_1"; defs?: GradientSpotTrailOpts }
    | { family: "spot_trail_2"; defs?: GradientSpotTrailOpts }
    | { family: "spot_trail_3"; defs?: GradientSpotTrailOpts };

export type TrackedGradientFamily = TrackedGradientEntry["family"];
