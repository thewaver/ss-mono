import type { CornerKey } from "./Corners.types";

export const CORNERS_DEFAULTS = {
    transitionDurationMs: 200,
    cornerLength: { width: 20, height: 20 },
    strokeThickness: 4,
    visibleCorners: new Set(["bottom_left", "bottom_right", "top_left", "top_right"]) as Set<CornerKey>,
};

export const CORNERS_KEYS: readonly CornerKey[] = ["top_left", "top_right", "bottom_left", "bottom_right"];
