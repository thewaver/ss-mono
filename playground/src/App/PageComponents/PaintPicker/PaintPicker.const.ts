import {
    SVGDefsSamples,
    TimedGradientDefaults,
    TrackedGradientDefaults,
    TrackedPatternDefaults,
} from "@thewaver/ss-components";

import { TimedGradientKnobs } from "../../Knobs/TimedGradients.const";
import { TrackedGradientKnobs } from "../../Knobs/TrackedGradients.const";
import { TrackedPatternKnobs } from "../../Knobs/TrackedPatterns.const";
import type { Knob } from "../Knobs/KnobDefs.types";
import type { PaintKind, PaintSampleKey, PaintSampleKind } from "./PaintKind.types";
import type { Paint } from "./PaintPicker.types";

export const NO_KNOBS = {};

export const PAINT_KINDS: PaintKind[] = ["solid", "pattern", "tracked_pattern", "timed", "tracked"];

export const PAINT_KIND_LABELS: Record<PaintKind, string> = {
    solid: "Solid",
    pattern: "Timed pattern",
    tracked_pattern: "Tracked pattern",
    timed: "Timed gradient",
    tracked: "Tracked gradient",
};

export const STARTING_KEYS: Record<PaintSampleKind, PaintSampleKey> = {
    pattern: "hexagon_pt_2",
    tracked_pattern: "hexagon_pt_fade_2",
    timed: "sweep_diag_1v1",
    tracked: "spot_1",
};

export const getIsUsingKind = (paints: Paint[], kinds: PaintKind[]) =>
    paints.some((paint) => kinds.includes(paint.kind));

export const getPaintKnobs = (kind: PaintKind, key: PaintSampleKey): Record<string, Knob> => {
    if (kind === "tracked_pattern") {
        return TrackedPatternKnobs.KNOBS_BY_FAMILY[key as SVGDefsSamples.Pattern.Tracked.SampleKey] as Record<
            string,
            Knob
        >;
    }

    if (kind === "timed") {
        return TimedGradientKnobs.KNOBS_BY_FAMILY[key as SVGDefsSamples.Gradient.Timed.SampleKey] as Record<
            string,
            Knob
        >;
    }

    if (kind === "tracked") {
        return TrackedGradientKnobs.KNOBS_BY_FAMILY[key as SVGDefsSamples.Gradient.Tracked.SampleKey] as Record<
            string,
            Knob
        >;
    }

    return NO_KNOBS;
};

export const getPaintDefaults = (kind: PaintKind, key: PaintSampleKey): Record<string, unknown> => {
    if (kind === "tracked_pattern") {
        return TrackedPatternDefaults.DEFAULTS_BY_FAMILY[key as SVGDefsSamples.Pattern.Tracked.SampleKey] as Record<
            string,
            unknown
        >;
    }

    if (kind === "timed") {
        return TimedGradientDefaults.DEFAULTS_BY_FAMILY[key as SVGDefsSamples.Gradient.Timed.SampleKey] as Record<
            string,
            unknown
        >;
    }

    if (kind === "tracked") {
        return TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key as SVGDefsSamples.Gradient.Tracked.SampleKey] as Record<
            string,
            unknown
        >;
    }

    return NO_KNOBS;
};
