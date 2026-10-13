import {
    type InteractionFlags,
    type SVGDefs,
    SVGDefsSampleConfigs,
    SVGDefsSamples,
} from "@thewaver/ss-components-solid";
import {
    computeNoSampleDefs,
    splitEntriesIntoGroups,
    toGroupEntries,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { Size2d } from "@thewaver/ss-utils";

import type { Paint, PaintSampleKey, PaintSampleKind, PaintSettings } from "./PaintPickerSolid.types";

export {
    PAINT_KINDS,
    PAINT_KIND_LABELS,
    STARTING_KEYS,
    getIsUsingKind,
    getPaintKnobs,
    getPaintDefaults,
} from "@thewaver/ss-playground/App/PageComponents/PaintPicker/PaintPicker.const";

export const SAMPLE_GROUPS: Record<PaintSampleKind, [string, PaintSampleKey[]][]> = {
    pattern: toGroupEntries(splitEntriesIntoGroups(SVGDefsSampleConfigs.Pattern.Timed.SAMPLE_CONFIGS)),
    tracked_pattern: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Pattern.Tracked.SAMPLE_ENTRIES)),
    timed: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES)),
    tracked: toGroupEntries(splitEntriesIntoGroups(SVGDefsSamples.Gradient.Tracked.SAMPLE_ENTRIES)),
};

export const computePaintDefs = (
    paint: Paint,
    settings: PaintSettings,
    paintKind: "fill" | "stroke",
    id: string,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
    getFlags?: () => InteractionFlags,
): SVGDefs[] => {
    const elementDefs = { getSize, colors: settings.colors, blurWidth: settings.blurWidth };
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
            return SVGDefsSampleConfigs.Pattern.Timed.SAMPLE_CONFIGS[
                paint.key as SVGDefsSamples.Pattern.Timed.SampleKey
            ].computeSVGDefs(id, getFlags, getRef, { ...elementDefs, ...animationDefs, cellSize: settings.cellSize });
        case "tracked_pattern":
            return SVGDefsSampleConfigs.Pattern.Tracked.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(id, getFlags, getRef, {
                ...elementDefs,
                cellSize: settings.cellSize,
            });
        case "timed":
            return SVGDefsSampleConfigs.Gradient.Timed.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(id, getFlags, getRef, {
                ...elementDefs,
                ...animationDefs,
            });
        case "tracked":
            return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
                family: paint.key,
                defs: paint.configDefs,
            } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(id, getFlags, getRef, elementDefs);
    }
};
