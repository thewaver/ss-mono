import type { InteractionFlags, SVGAnimationDefs, SVGDefs } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGDefsColors = { [K in "primary" | "secondary" | "tertiary" | "background"]: string };

export type IterationConfig = {
    computeDefs: (animationDurationMs: number) => Pick<SVGAnimationDefs, "animationIterationPatterns">;
};

export type PatternElementDefs = SVGAnimationDefs & {
    getSize: () => Size2d;
    cellSize: Size2d;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type PatternConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        defs: PatternElementDefs,
    ) => SVGDefs[];
};

export type GradientElementDefs = SVGAnimationDefs & {
    getSize: () => Size2d;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type GradientConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        defs: GradientElementDefs,
    ) => SVGDefs[];
};
