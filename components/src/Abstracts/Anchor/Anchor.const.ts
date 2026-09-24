import type { AnchorHPlacement, AnchorVPlacement } from "./Anchor.types";

export const ANCHOR_H_PLACEMENTS: readonly AnchorHPlacement[] = [
    "left-out",
    "left-in",
    "center",
    "right-in",
    "right-out",
];

export const ANCHOR_V_PLACEMENTS: readonly AnchorVPlacement[] = [
    "top-out",
    "top-in",
    "center",
    "bottom-in",
    "bottom-out",
];
