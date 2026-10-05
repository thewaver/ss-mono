import type { Ref } from "vue";

import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-vue";
import type { Size2d } from "@thewaver/ss-utils";

export type PaintKind = "solid" | "pattern" | "tracked_pattern" | "timed" | "tracked";

export type PaintSampleKind = Exclude<PaintKind, "solid">;

export type PaintSampleKey =
    | SVGDefsSamples.Pattern.Timed.SampleKey
    | SVGDefsSamples.Pattern.Tracked.SampleKey
    | SVGDefsSamples.Gradient.Timed.SampleKey
    | SVGDefsSamples.Gradient.Tracked.SampleKey;

export type Paint = {
    kind: PaintKind;
    key: PaintSampleKey;
    configDefs: Record<string, number | boolean>;
};

export type PaintSettings = {
    colors: SVGDefsColors;
    blurWidth?: number;
    animationDurationMs: number;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    cellSize: Size2d;
};

export type PaintSlot = {
    paint: Readonly<Ref<Paint>>;
    setKind: (kind: PaintKind) => void;
    setKey: (key: PaintSampleKey) => void;
    setConfigDef: (name: string, value: number | boolean) => void;
};

export type PagePaintPickerProps = {
    paintSlot: PaintSlot;
    name: string;
    label: string;
    hint: string;
};
