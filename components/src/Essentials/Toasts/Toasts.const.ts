import type { ToastsAlignment, ToastsAriaLive, ToastsDir, ToastsOverflow } from "./Toasts.types";

export const TOASTS_DEFAULTS = {
    transitionDurationMs: 300,
    alignment: "bottom-right" as ToastsAlignment,
    dir: "column" as ToastsDir,
    overflow: "dismiss-oldest" as ToastsOverflow,
    hotkey: "F8",
    ariaLive: "polite" as ToastsAriaLive,
    gap: 10,
};
