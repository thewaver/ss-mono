import type {
    InteractionFlags,
    TimedGradientElementDefs,
    TimedPatternElementDefs,
    TrackedGradientElementDefs,
    TrackedPatternElementDefs,
} from "@thewaver/ss-components";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";

export type TimedPatternConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TimedPatternElementDefs,
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

export type TrackedPatternConfig = {
    computeSVGDefs: (
        id: string,
        getInteractionFlags: (() => InteractionFlags) | undefined,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TrackedPatternElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientFactory<T = void> = T extends void
    ? () => TimedGradientConfig
    : (opts?: T) => TimedGradientConfig;

export type TrackedGradientFactory<T = void> = T extends void
    ? () => TrackedGradientConfig
    : (opts?: T) => TrackedGradientConfig;

export type TrackedPatternFactory<T = void> = T extends void
    ? () => TrackedPatternConfig
    : (opts?: T) => TrackedPatternConfig;
