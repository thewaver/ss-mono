import type { PaintedTextStrokeAlignment } from "./PaintedText.types";

export const PAINTED_TEXT_DEFAULTS = {
    strokeWidth: 2,
    strokeAlignment: "outside" as PaintedTextStrokeAlignment,
    isFittedToPath: false,
    lapDurationMs: 10000,
    playback: false,
};
