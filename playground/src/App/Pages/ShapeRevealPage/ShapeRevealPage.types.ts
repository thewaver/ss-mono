import type { ShapeRevealSpot } from "@thewaver/ss-components";
import type { ShapeConst } from "@thewaver/ss-utils";

export type ShapeRevealPageShape = "circle" | ShapeConst.DefaultShape;

export type ShapeRevealPageOrigin = ShapeRevealSpot | "button";

export type ShapeRevealPanel = "dawn" | "dusk";

export type ShapeRevealRun = {
    shape: ShapeRevealPageShape;
    origin: ShapeRevealPageOrigin;
    hasAnimated: boolean;
    panel: ShapeRevealPanel;
};
