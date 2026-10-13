import type { ReactNode } from "react";

import type { BaseTypewriterProps, TypewriterUpdateCause } from "@thewaver/ss-components";

export type TypewriterController = {
    /**
     * Plays the text in again from nothing, whether or not it is already running — a restart is a command,
     * so asking for one mid-run is exactly when it means something.
     *
     * @returns `true`, since it always acts.
     */
    restartAnimation: () => boolean;
    /**
     * Re-measures the text and re-splits it, for a change the component cannot see for itself. The measurement is
     * taken once React has applied the render the call arrives in, so a consumer may change the children and ask
     * for this in the same breath; a layout cause that finds the width unchanged is skipped then.
     *
     * @param cause What changed, so the `resetAnimationOnContent` and `resetAnimationOnLayout` preferences
     * can be honored.
     * @returns `false` when there is nothing to measure, `true` when the measurement is on its way.
     */
    update: (cause: TypewriterUpdateCause) => boolean;
};

export type TypewriterProps = BaseTypewriterProps & {
    /** The text to type, with whatever markup, links and images it carries. It is measured, then redrawn. */
    children?: ReactNode;
    /**
     * Draws a caret after the character that arrived most recently, or before the one leaving while erasing.
     * It is placed from the same progress the characters are drawn from, so it cannot drift from the text, and
     * it follows the text onto the next line. It is drawn again at every step, so a blink restarts
     * per character and reads as solid while typing. Meant for in-order weights: with a scatter it jumps to
     * wherever the last arrival was. It takes inline space and is decoration, so keep it narrow and mark it
     * `aria-hidden="true"`.
     */
    renderCaret?: () => ReactNode;
    /**
     * How far the typing has gone, `0` for nothing yet and `1` for every character in place.
     *
     * While it plays, the typewriter writes it as it goes. With `playback` off, writing it draws that moment of the
     * run: every character's keyframes are held at the matching point, so a moment can fall partway through one
     * character's own animation, and a character not yet reached shows its animation's first frame. That is what
     * lets a scroll position or a song's current time drive the text. A change to the text or its layout sends it
     * back to `0` only while playing.
     */
    progress?: readonly [number, (value: number) => void];
    /**
     * Whether the typing plays on its own. It stays on once a run has ended, which is what lets a change of text play
     * the typing in again; a consumer driving `progress` from outside turns it off.
     */
    playback?: readonly [boolean, (value: boolean) => void];
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: TypewriterController) => void;
};
