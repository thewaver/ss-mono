import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type ShapeRevealSpot = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type ShapeRevealOrigin = ShapeRevealSpot | Point2d | Element;

export type ShapeRevealOpts = {
    origin?: ShapeRevealOrigin;
    durationMs?: number;
    easing?: string;
    computePoints?: (size: Size2d) => Point2d[];
    blur?: number;
};

export type ShapeRevealChange = () => unknown;
