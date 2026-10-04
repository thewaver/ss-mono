import type { ShapeRevealSpot } from "./ShapeReveal.types";

export const SHAPE_REVEAL_DEFAULTS = {
    origin: "center" as ShapeRevealSpot,
    durationMs: 700,
    easing: "ease-in-out",
    blur: 0,
};

export const SHAPE_REVEAL_SPOTS: readonly ShapeRevealSpot[] = [
    "center",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
];
