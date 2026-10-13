import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { PaintKind, PaintSampleKey } from "./PaintKind.types";

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
