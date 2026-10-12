import type { AnchorHPlacement, AnchorVPlacement } from "./Anchor.types";

export const ANCHOR_H_PLACEMENTS: readonly AnchorHPlacement[] = [
    "left_out",
    "left_in",
    "center",
    "right_in",
    "right_out",
];

export const ANCHOR_V_PLACEMENTS: readonly AnchorVPlacement[] = [
    "top_out",
    "top_in",
    "center",
    "bottom_in",
    "bottom_out",
];
