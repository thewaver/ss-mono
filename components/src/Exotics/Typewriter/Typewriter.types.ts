import type { JSX } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

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

export type TypewriterProps = AccessorProps<{
    /** The animation each character arrives with. */
    animationName?: string;
    /** How long one character takes to arrive. */
    animationDurationMs?: number;
    /** How long each character waits after the one before it, which is what makes the text type rather than appear. */
    animationDelayMs?: number;
    /** How long to wait before the first character arrives. */
    initialAnimationDelayMs?: number;
    /**
     * Whether the characters arrive or leave. `erase` runs each character's animation backwards, last character
     * first, and leaves the text hidden once it ends, whatever the animation's first frame draws. Changing it
     * starts a run, so a phrase can be typed, held and erased by switching it from `onAnimationEnd`.
     */
    mode?: TypewriterMode;
    /**
     * Decides the order the characters arrive in, as a weight per character from `0` for the first to `1` for
     * the last; an image or a line break counts as one. The whole run takes the character count times
     * `animationDelayMs`, and each character starts at its weight's share of it. Erasing reverses the weights.
     * Leave it out for left to right.
     */
    computeCharacterWeights?: (count: number) => number[];
    /**
     * Draws a caret after the character that arrived most recently, or before the one leaving while erasing.
     * It moves when a character's own animation starts rather than on a timer, so it cannot drift from the
     * text and it follows the text onto the next line. It is drawn again at every step, so a blink restarts
     * per character and reads as solid while typing. Meant for in-order weights: with a scatter it jumps to
     * wherever the last arrival was. It takes inline space and is decoration, so keep it narrow and mark it
     * `aria-hidden="true"`.
     */
    renderCaret?: () => JSX.Element;
    /** Starts the typing again when the text is re-laid out, for text that reflows as the window changes. */
    resetAnimationOnLayout?: boolean;
    /** Starts the typing again when the text itself changes. */
    resetAnimationOnContent?: boolean;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: TypewriterController) => void;
    /** Runs once every character has arrived. */
    onAnimationEnd?: () => void;
}>;
