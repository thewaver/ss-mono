import type { ShapeRevealSpot } from "./ShapeReveal.types";

export const SHAPE_REVEAL_DEFAULTS = {
    origin: "center" as ShapeRevealSpot,
    durationMs: 700,
    easing: "ease-in-out",
    blur: 0,
};

export const SHAPE_REVEAL_SPOTS: readonly ShapeRevealSpot[] = [
    "center",
    "top_left",
    "top_right",
    "bottom_left",
    "bottom_right",
];
