import type { ElementSegment } from "@thewaver/ss-utils";

export type TypewriterUpdateCause = "content" | "layout" | "other";

export type TypewriterMode = "type" | "erase";

export type TypewriterController = {
    /**
     * Plays the text in again from nothing, whether or not it is already running — a restart is a command,
     * so asking for one mid-run is exactly when it means something.
     *
     * @returns `true`, since it always acts.
     */
    restartAnimation: () => boolean;
    /**
     * Re-measures the text and re-splits it, for a change the component cannot see for itself.
     *
     * @param cause What changed, so the `resetAnimationOnContent` and `resetAnimationOnLayout` preferences
     * can be honored.
     * @returns `false` when there was nothing to measure, or when a layout cause found the width unchanged
     * and the work was skipped.
     */
    update: (cause: TypewriterUpdateCause) => boolean;
};

export type TypewriterSegment = ElementSegment & {
    /** Where the segment's first character sits among every animated character, an image or a break counting as one. */
    startIndex: number;
};

export type TypewriterState = {
    /** The measured text, split and wrapped at the width it was measured at. */
    segments: TypewriterSegment[];
    /** How many characters arrive, an image or a break counting as one. */
    count: number;
    /** The width the text was wrapped at, or `undefined` before it was first measured. */
    width: number | undefined;
    /** Whether a run is playing. */
    isAnimating: boolean;
    /** Whether a run has ever started, which is what lets the reset preferences skip the ones after. */
    hasAnimatedOnce: boolean;
    /** The character the caret follows, or `-1` for before the first. */
    caretIndex: number;
};

export type TypewriterPlayerOpts = {
    /** The element holding the text to measure: the hidden copy the consumer's children are rendered into. */
    getContainer: () => HTMLElement | undefined;
    /** How long one character takes to arrive. */
    getAnimationDurationMs: () => number;
    /** How long each character waits after the one before it. */
    getAnimationDelayMs: () => number;
    /** How long to wait before the first character arrives. */
    getInitialAnimationDelayMs: () => number;
    /** Whether the characters are leaving rather than arriving. */
    getIsErasing: () => boolean;
    /** Whether a change to the text itself starts the typing again. Only `false` stops it. */
    getResetAnimationOnContent: () => boolean | undefined;
    /** Whether a re-layout starts the typing again. Only `false` stops it. */
    getResetAnimationOnLayout: () => boolean | undefined;
    /** Runs once every character has arrived. */
    onAnimationEnd?: () => void;
};

export type TypewriterPlayer = {
    /** The player's state. */
    get: () => TypewriterState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Re-measures and re-splits the text, then starts a run unless the cause's preference says not to. */
    update: (cause: TypewriterUpdateCause) => boolean;
    /** Starts a run from nothing, unless the cause's preference says not to. */
    restart: (cause?: TypewriterUpdateCause) => void;
    /** Moves the caret to follow a character whose own animation has just started. */
    reportCharacterStart: (index: number) => void;
    /** Re-measures whenever the container changes size, until the returned function is called. */
    observe: (container: HTMLElement) => () => void;
    /** Stops the run under way, leaving it where it is. */
    stop: () => void;
};
