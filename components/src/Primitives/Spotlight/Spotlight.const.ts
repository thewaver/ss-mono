import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";

export const SPOTLIGHT_DEFAULTS = {
    transitionDurationMs: 200,
    padding: 0,
    popupPlacement: { x: "center", y: "bottom_out" } as AnchorPlacement,
    popupOffset: { x: 0, y: 8 },
};
