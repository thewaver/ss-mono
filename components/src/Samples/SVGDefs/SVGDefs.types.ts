import type { Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { SVGAnimationDefs } from "../../Abstracts/SVG/Defs/Animation/SVGAnimationDefs.types";
import type { SVGDefs } from "../../Abstracts/SVG/Defs/SVGDefs.types";

export type SVGDefsColors = { [K in "primary" | "secondary" | "tertiary" | "background"]: string };

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

export type GradientBandedCycleOpts = GradientCycleOpts & { banded?: boolean };

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
    | { family: "orbit_1"; defs?: GradientCycleOpts }
    | { family: "orbit_1v1"; defs?: GradientCycleOpts }
    | { family: "orbit_async_2v1" }
    | { family: "orbit_async_3" }
    | { family: "scan_1"; defs?: GradientCycleOpts }
    | { family: "scan_1v1"; defs?: GradientCycleOpts }
    | { family: "scan_diag_1"; defs?: GradientCycleOpts }
    | { family: "scan_diag_1v1"; defs?: GradientCycleOpts }
    | { family: "snake_1"; defs?: GradientCycleOpts }
    | { family: "snake_1v1"; defs?: GradientCycleOpts }
    | { family: "snake_2"; defs?: GradientCycleOpts }
    | { family: "snake_4"; defs?: GradientCycleOpts }
    | { family: "snake_async_3" }
    | { family: "snake_inter_2"; defs?: GradientCycleOpts }
    | { family: "sweep_1"; defs?: GradientCycleOpts }
    | { family: "sweep_1v1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_1v1"; defs?: GradientCycleOpts }
    | { family: "sweep_diag_async_4"; defs?: GradientCycleOpts };

export type TimedGradientFamily = TimedGradientEntry["family"];

export type TrackedGradientEntry =
    | { family: "band_1" }
    | { family: "band_1v1" }
    | { family: "band_diag_1" }
    | { family: "hand_1" }
    | { family: "hand_trail_1" }
    | { family: "hand_trail_2"; defs?: GradientCycleOpts }
    | { family: "hand_trail_3"; defs?: GradientCycleOpts }
    | { family: "spot_1" }
    | { family: "spot_flare_2" }
    | { family: "spot_flare_3" }
    | { family: "spot_ripple_1" }
    | { family: "spot_ripple_2"; defs?: GradientCycleOpts }
    | { family: "spot_ripple_3"; defs?: GradientCycleOpts }
    | { family: "spot_smear_2"; defs?: GradientCycleOpts }
    | { family: "spot_smear_3"; defs?: GradientCycleOpts }
    | { family: "spot_trail_1" }
    | { family: "spot_trail_2"; defs?: GradientCycleOpts }
    | { family: "spot_trail_3"; defs?: GradientCycleOpts };

export type TrackedGradientFamily = TrackedGradientEntry["family"];
