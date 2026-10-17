import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";

export const FLYOUT_MENU_DEFAULTS = {
    gap: 0,
    placement: { x: "left_in", y: "bottom_out" } as AnchorPlacement,
    transitionDurationMs: 200,
    floaterTransitionDurationMs: 100,
    hoverShowDelayMs: 200,
    skipDelayWindowMs: 300,
};
