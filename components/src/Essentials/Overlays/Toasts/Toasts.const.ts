import type { ToastsAlignment, ToastsAriaLive, ToastsDir, ToastsOverflow } from "./Toasts.types";

export const TOASTS_DEFAULTS = {
    transitionDurationMs: 300,
    alignment: "bottom-right" as ToastsAlignment,
    dir: "column" as ToastsDir,
    overflow: "dismiss-oldest" as ToastsOverflow,
    hotkey: "F8",
    ariaLive: "polite" as ToastsAriaLive,
    gap: 10,
    isDismissableOnSwipe: true,
};

export const TOASTS_ALIGNMENTS: readonly ToastsAlignment[] = [
    "top-left",
    "top-center",
    "top-right",
    "middle-left",
    "middle-center",
    "middle-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
];

export const TOASTS_DIRS: readonly ToastsDir[] = ["column", "column-reverse", "row", "row-reverse"];

export const TOASTS_OVERFLOWS: readonly ToastsOverflow[] = ["dismiss-oldest", "hold-newest"];
