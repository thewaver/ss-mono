import type { SlotTextLetterRoute, SlotTextMechanism } from "./SlotText.types";

export const SLOT_TEXT_DEFAULTS = {
    turnDelayMs: 90,
    turnDurationMs: 600,
    mechanism: "drum" as SlotTextMechanism,
    letters: "",
    letterRoute: "forward" as SlotTextLetterRoute,
};
