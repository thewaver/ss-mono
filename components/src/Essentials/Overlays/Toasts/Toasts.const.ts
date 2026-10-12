import type { ToastsAlignment, ToastsAriaLive, ToastsDir, ToastsOverflow } from "./Toasts.types";

export const TOASTS_DEFAULTS = {
    transitionDurationMs: 300,
    alignment: "bottom_right" as ToastsAlignment,
    dir: "column" as ToastsDir,
    overflow: "dismiss_oldest" as ToastsOverflow,
    hotkey: "F8",
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

export const TOASTS_DIRS: readonly ToastsDir[] = ["column", "column-reverse", "row", "row-reverse"];

export const TOASTS_OVERFLOWS: readonly ToastsOverflow[] = ["dismiss_oldest", "hold_newest"];
