import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";

export const HOVER_CARD_DEFAULTS = {
    transitionDurationMs: 200,
    focusShowDelayMs: 500,
    hoverShowDelayMs: 700,
    skipDelayWindowMs: 300,
    placement: { x: "center", y: "bottom-out" } as AnchorPlacement,
};
