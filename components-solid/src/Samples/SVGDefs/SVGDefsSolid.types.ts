import type {
    InteractionFlags,
    PatternElementDefs,
    TimedGradientElementDefs,
    TrackedGradientElementDefs,
} from "@thewaver/ss-components";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";

export type PatternConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: PatternElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TimedGradientElementDefs,
    ) => SVGDefs[];
};

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
