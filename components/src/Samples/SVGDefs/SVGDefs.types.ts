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
