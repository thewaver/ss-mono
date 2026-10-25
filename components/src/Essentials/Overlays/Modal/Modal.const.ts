import type { ModalAlignment, ModalRole } from "./Modal.types";

export const MODAL_DEFAULTS = {
    transitionDurationMs: 200,
    alignment: "center" as ModalAlignment,
    role: "dialog" as ModalRole,
    isDismissableOnOverlayClick: true,
    isDismissableOnEscape: true,
};

export const MODAL_ALIGNMENTS: readonly ModalAlignment[] = ["center", "left", "right", "top", "bottom"];
