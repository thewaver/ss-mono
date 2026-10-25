import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";

export const FLYOUT_MENU_DEFAULTS = {
    gap: 0,
    placement: {
        ltr: { x: "left_in", y: "bottom_out" },
        rtl: { x: "right_in", y: "bottom_out" },
    } as Record<NavigatorDirection, AnchorPlacement>,
    transitionDurationMs: 200,
    floaterTransitionDurationMs: 100,
    hoverShowDelayMs: 200,
    skipDelayWindowMs: 300,
};
