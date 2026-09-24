import type { CornerKey } from "./Corners.types";

export const CORNERS_DEFAULTS = {
    transitionDurationMs: 200,
    cornerLength: { width: 20, height: 20 },
    strokeThickness: 4,
    visibleCorners: new Set(["bottomLeft", "bottomRight", "topLeft", "topRight"]) as Set<CornerKey>,
};

export const CORNERS_KEYS: readonly CornerKey[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
