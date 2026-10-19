import type { Point2d } from "@thewaver/ss-utils";

export type PanZoomAction =
    | { key: string; label: string; glyph: string; kind: "zoom"; factor: number }
    | { key: string; label: string; glyph: string; kind: "pan"; ratio: Point2d };
