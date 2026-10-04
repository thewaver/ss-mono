import type { Store } from "@thewaver/ss-utils";

export type MorphTextCopyStyle = {
    /** How far the copy is blurred, in pixels. */
    blurPx: number;
    /** How opaque the copy is, `0` to `1`. */
    opacity: number;
};

export type MorphTextState = {
    /** The text being morphed to, or resting on. */
    current: string;
    /** The text being morphed away from, or `undefined` while nothing is morphing. */
    previous: string | undefined;
    /** How far the morph has run, `0` to `1`; `1` at rest. */
    progress: number;
};

export type MorphTextMorpherOpts = {
    /** How long one morph takes. `0` or less swaps the text at once. */
    getMorphDurationMs: () => number;
    /** Runs once a morph has finished. */
    onMorphEnd?: (text: string) => void;
};

export type MorphTextMorpher = Store<MorphTextState> & {
    /** Starts a morph to `text` from whatever is drawn now. Asking for the text already being shown does nothing. */
    morphTo: (text: string) => void;
    /** Puts `text` straight on, with no morph, stopping any under way. */
    rest: (text: string) => void;
    /** Stops any morph under way, leaving the new text on. */
    stop: () => void;
};
