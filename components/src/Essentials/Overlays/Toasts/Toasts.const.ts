import type { ToastsAlignment, ToastsAriaLive, ToastsFlexDirection, ToastsOverflow } from "./Toasts.types";

export const TOASTS_DEFAULTS = {
    transitionDurationMs: 300,
    alignment: "bottom_right" as ToastsAlignment,
    flexDirection: "column" as ToastsFlexDirection,
    overflow: "dismiss_oldest" as ToastsOverflow,
    ariaLive: "polite" as ToastsAriaLive,
    gap: 10,
    isDismissableOnSwipe: true,
};

export const TOASTS_ALIGNMENTS: readonly ToastsAlignment[] = [
    "top_left",
    "top_center",
    "top_right",
    "middle_left",
    "middle_center",
    "middle_right",
    "bottom_left",
    "bottom_center",
    "bottom_right",
];

export const TOASTS_FLEX_DIRECTIONS: readonly ToastsFlexDirection[] = [
    "column",
    "column-reverse",
    "row",
    "row-reverse",
];

export const TOASTS_OVERFLOWS: readonly ToastsOverflow[] = ["dismiss_oldest", "hold_newest"];
