import type { Point2d } from "@thewaver/ss-utils";

export type CornerKey = "top_left" | "top_right" | "bottom_right" | "bottom_left";

export type QuadWarpCorners = Record<CornerKey, Point2d>;

export type QuadWarpAxis = "x" | "y";
