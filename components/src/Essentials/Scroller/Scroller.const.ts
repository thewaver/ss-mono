import type { ScrollerAxis, ScrollerBarSide, ScrollerOverflow } from "./Scroller.types";

export const SCROLLER_DEFAULTS = {
    padding: 0,
    overlapCount: 0,
    overflowX: "auto" as ScrollerOverflow,
    overflowY: "hidden" as ScrollerOverflow,
    barSideX: "end" as ScrollerBarSide,
    barSideY: "end" as ScrollerBarSide,
    isAutoHiding: false,
    hideDelayMs: 600,
    isBarOverlaid: false,
};

export const SCROLLER_OVERFLOWS: ScrollerOverflow[] = ["auto", "scroll", "hidden"];

export const SCROLLER_AXES: ScrollerAxis[] = ["x", "y"];

export const SCROLLER_BAR_SIDES: ScrollerBarSide[] = ["start", "end"];
