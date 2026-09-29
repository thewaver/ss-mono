import type {
    InteractionFlags,
    PatternElementDefs,
    TimedGradientElementDefs,
    TrackedGradientElementDefs,
} from "@thewaver/ss-components";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types.js";
import type { SvelteMarkup } from "../../Utils/typeUtils.js";

export type PatternConfig = {
    computeSVGDefs: (
        id: string,
        interactionFlags: InteractionFlags | undefined,
        element: HTMLElement | undefined,
        defs: PatternElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientConfig = {
    computeSVGDefs: (
        id: string,
        interactionFlags: InteractionFlags | undefined,
        element: HTMLElement | undefined,
        defs: TimedGradientElementDefs,
    ) => SVGDefs[];
};

export type TrackedGradientConfig = {
    computeSVGDefs: (
        id: string,
        interactionFlags: InteractionFlags | undefined,
        element: HTMLElement | undefined,
        defs: TrackedGradientElementDefs,
    ) => SVGDefs[];
};

export type TimedGradientFactory<T = void> = T extends void
    ? () => TimedGradientConfig
    : (opts?: T) => TimedGradientConfig;

export type TrackedGradientFactory<T = void> = T extends void
    ? () => TrackedGradientConfig
    : (opts?: T) => TrackedGradientConfig;

export type SVGSampleClipPathProps = {
    /** The id the `clipPath` carries, which a paint points at with `clip-path: url(#…)`. */
    id: string;
    /**
     * The shapes the clip is cut to, laid out in the painted element's bounding box, where `0` to `1` spans it on
     * each axis.
     */
    content: SvelteMarkup;
};
