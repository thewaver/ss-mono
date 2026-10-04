import type { LetterSegment } from "../../../Abstracts/LetterDriver/LetterDriver.types";

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

export type TypewriterState = {
    /** The measured text, split and wrapped at the width it was measured at. */
    segments: LetterSegment[];
    /** How many characters arrive, an image or a break the text holds counting as one. */
    count: number;
    /** The width the text was wrapped at, or `undefined` before it was first measured. */
    width: number | undefined;
    /** Whether a run has ever started, which is what lets the reset preferences skip the ones after. */
    hasAnimatedOnce: boolean;
};

export type TypewriterPlayerOpts = {
    /** The element holding the text to measure: the hidden copy the consumer's children are rendered into. */
    getContainer: () => HTMLElement | undefined;
    /** Names each letter's keyframes, which the text is wrapped for — see `LetterDriverUtils.wrapAtLastFrame`. */
    getComputeAnimationName: () => (character: string, index: number, count: number) => string;
    /** Whether the run is playing, which is the only time a change starts it again from the beginning. */
    getIsPlaying: () => boolean;
    /** Moves the run, `0` for its beginning and `1` for its end. */
    setProgress: (progress: number) => void;
    /** Whether a change to the text itself starts the typing again. Only `false` stops it. */
    getResetAnimationOnContent: () => boolean | undefined;
    /** Whether a re-layout starts the typing again. Only `false` stops it. */
    getResetAnimationOnLayout: () => boolean | undefined;
    /**
     * Whether a drawer inside the typewriter draws the letters, in which case the player measures nothing and is
     * told its letter count instead.
     */
    getIsDriven?: () => boolean;
};

export type TypewriterPlayer = {
    /** The player's state. */
    get: () => TypewriterState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Re-measures and re-splits the text, then starts the run again unless the cause's preference says not to. */
    update: (cause: TypewriterUpdateCause) => boolean;
    /** Starts the run again from the beginning while it is playing, unless the cause's preference says not to. */
    restart: (cause?: TypewriterUpdateCause) => void;
    /**
     * Sets how many letters there are, as a drawer reports them, then starts the run again unless the cause's
     * preference says not to.
     */
    setCount: (count: number, cause: TypewriterUpdateCause) => void;
    /**
     * Re-measures whenever the container changes size or content, or a web font or an image in the text finishes
     * loading, until the returned function is called.
     */
    observe: (container: HTMLElement) => () => void;
};
