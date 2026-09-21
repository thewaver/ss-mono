import type { AccessorProps } from "../../Utils/typeUtils";

export type TypewriterUpdateCause = "content" | "layout" | "other";

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

export type TypewriterProps = AccessorProps<{
    /** The animation each character arrives with. */
    animationName?: string;
    /** How long one character takes to arrive. */
    animationDurationMs?: number;
    /** How long each character waits after the one before it, which is what makes the text type rather than appear. */
    animationDelayMs?: number;
    /** How long to wait before the first character arrives. */
    initialAnimationDelayMs?: number;
    /** Starts the typing again when the text is re-laid out, for text that reflows as the window changes. */
    resetAnimationOnLayout?: boolean;
    /** Starts the typing again when the text itself changes. */
    resetAnimationOnContent?: boolean;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: TypewriterController) => void;
    /** Runs once every character has arrived. */
    onAnimationEnd?: () => void;
}>;
