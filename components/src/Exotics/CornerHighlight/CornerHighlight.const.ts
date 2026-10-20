import type { QuadCorner } from "@thewaver/ss-utils";

export const CORNER_HIGHLIGHT_DEFAULTS = {
    transitionDurationMs: 200,
    cornerLength: { width: 20, height: 20 },
    strokeThickness: 4,
    visibleCorners: new Set(["bottom_left", "bottom_right", "top_left", "top_right"]) as Set<QuadCorner>,
};

export const CORNER_HIGHLIGHT_KEYS: readonly QuadCorner[] = ["top_left", "top_right", "bottom_left", "bottom_right"];
