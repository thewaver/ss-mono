import {
    type InteractionFlags,
    type SVGDefs,
    SVGDefsSamples,
    TimedGradientDefaults,
    TrackedGradientDefaults,
    TrackedPatternDefaults,
} from "@thewaver/ss-components-svelte";
import {
    computeNoSampleDefs,
    splitEntriesIntoGroups,
    toGroupEntries,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { Size2d } from "@thewaver/ss-utils";

import { TimedGradientKnobs } from "../../Knobs/TimedGradients.const";
import { TrackedGradientKnobs } from "../../Knobs/TrackedGradients.const";
import { TrackedPatternKnobs } from "../../Knobs/TrackedPatterns.const";
import type { Knob } from "../Knobs/Knobs.types";
import type { Paint, PaintKind, PaintSampleKey, PaintSampleKind, PaintSettings } from "./PaintPicker.types";

const NO_KNOBS = {};

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

export const SAMPLE_GROUPS: Record<PaintSampleKind, [string, PaintSampleKey[]][]> = {
    pattern: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Pattern.Timed.SAMPLE_CONFIGS)),
    tracked_pattern: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Pattern.Tracked.SAMPLE_ENTRIES)),
    timed: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES)),
    tracked: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES)),
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

export const computePaintDefs = (
    paint: Paint,
    settings: PaintSettings,
    paintKind: "fill" | "stroke",
    id: string,
    size: Size2d,
    element: HTMLElement | undefined,
    flags?: InteractionFlags,
): SVGDefs[] => {
    const elementDefs = { getSize: () => size, colors: settings.colors, blurWidth: settings.blurWidth };
    const animationDefs = {
        animationDurationMs: settings.animationDurationMs,
        ...SVGDefsSamples.Iteration.SAMPLE_CONFIGS[settings.iterationConfigKey].computeDefs(
            settings.animationDurationMs,
        ),
    };

    switch (paint.kind) {
        case "solid":
            return computeNoSampleDefs(settings.colors, paintKind);
        case "pattern":
            return SVGDefsSamples.Pattern.Timed.SAMPLE_CONFIGS[
                paint.key as SVGDefsSamples.Pattern.Timed.SampleKey
            ].computeSVGDefs(id, flags, element, { ...elementDefs, ...animationDefs, cellSize: settings.cellSize });
        case "tracked_pattern":
            return SVGDefsSamples.Pattern.Tracked.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(id, flags, element, {
                ...elementDefs,
                cellSize: settings.cellSize,
            });
        case "timed":
            return SVGDefsSamples.Gradient.Timed.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(id, flags, element, {
                ...elementDefs,
                ...animationDefs,
            });
        case "tracked":
            return SVGDefsSamples.Gradient.Tracked.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(id, flags, element, elementDefs);
    }
};
