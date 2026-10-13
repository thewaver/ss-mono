import type { SVGDefsSamples } from "@thewaver/ss-components";

export type PaintKind = "solid" | "pattern" | "tracked_pattern" | "timed" | "tracked";

export type PaintSampleKind = Exclude<PaintKind, "solid">;

export type PaintSampleKey =
    | SVGDefsSamples.Pattern.Timed.SampleKey
    | SVGDefsSamples.Pattern.Tracked.SampleKey
    | SVGDefsSamples.Gradient.Timed.SampleKey
    | SVGDefsSamples.Gradient.Tracked.SampleKey;
