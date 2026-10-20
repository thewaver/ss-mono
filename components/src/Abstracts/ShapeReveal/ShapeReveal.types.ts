import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type ShapeRevealSpot = "center" | "top_left" | "top_right" | "bottom_left" | "bottom_right";

export type ShapeRevealOrigin = ShapeRevealSpot | Point2d | Element;

export type ShapeRevealOpts = {
    origin?: ShapeRevealOrigin;
    durationMs?: number;
    easing?: string;
    computePoints?: (size: Size2d) => Point2d[];
    softness?: number;
    startDegrees?: number;
    endDegrees?: number;
};

export type ShapeRevealChange = () => unknown;
