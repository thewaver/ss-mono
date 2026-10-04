import type { VNodeChild } from "vue";

import type { TypewriterMode, TypewriterUpdateCause } from "@thewaver/ss-components";

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
     * taken once Vue has applied the update the call arrives in, so a consumer may change the children and ask
     * for this in the same breath; a layout cause that finds the width unchanged is skipped then.
     *
     * @param cause What changed, so the `resetAnimationOnContent` and `resetAnimationOnLayout` preferences
     * can be honored.
     * @returns `false` when there is nothing to measure, `true` when the measurement is on its way.
     */
    update: (cause: TypewriterUpdateCause) => boolean;
};

export type TypewriterProps = {
    /**
     * Names the keyframes one character arrives with, from the character itself, where it falls among all of them
     * from `0`, and how many there are — so every A can play one animation, odd letters another, and letters can fly
     * outward from the middle. An image or other whole element is passed as `"\uFFFC"` and a line break the text
     * holds as `"\n"`; a break the wrapping inserted is not a character and is never asked about. Return the same
     * name every time for one animation throughout. A change in the names it gives for the same text starts the
     * typing again.
     */
    "computeAnimationName"?: (character: string, index: number, count: number) => string;
    /** How long one character takes to arrive. */
    "animationDurationMs"?: number;
    /** How long each character waits after the one before it, which is what makes the text type rather than appear. */
    "animationDelayMs"?: number;
    /** How long to wait before the first character arrives. */
    "initialAnimationDelayMs"?: number;
    /**
     * Whether the characters arrive or leave. `erase` runs each character's animation backwards, last character
     * first, and leaves the text hidden once it ends, whatever the animation's first frame draws. Changing it
     * starts a run, so a phrase can be typed, held and erased by switching it from `onAnimationEnd`.
     */
    "mode"?: TypewriterMode;
    /**
     * Decides the order the characters arrive in, as a weight per character from `0` for the first to `1` for
     * the last; an image or a line break counts as one. The whole run takes the character count times
     * `animationDelayMs`, and each character starts at its weight's share of it. Erasing reverses the weights.
     * Leave it out for left to right.
     */
    "computeCharacterWeights"?: (count: number) => number[];
    /** Starts the typing again when the text is re-laid out, for text that reflows as the window changes. */
    "resetAnimationOnLayout"?: boolean;
    /** Starts the typing again when the text itself changes. */
    "resetAnimationOnContent"?: boolean;
    /**
     * How far the typing has gone, `0` for nothing yet and `1` for every character in place.
     *
     * While it plays, the typewriter writes it as it goes. With `playback` off, writing it draws that moment of the
     * run: every character's keyframes are held at the matching point, so a moment can fall partway through one
     * character's own animation, and a character not yet reached shows its animation's first frame. That is what
     * lets a scroll position or a song's current time drive the text. A change to the text or its layout sends it
     * back to `0` only while playing.
     */
    "progress"?: number;
    /** Receives the typing's progress as it goes, which is what `v-model:progress` binds. */
    "onUpdate:progress"?: (progress: number) => void;
    /**
     * Whether the typing plays on its own. It stays on once a run has ended, which is what lets a change of text play
     * the typing in again; a consumer driving `progress` from outside turns it off.
     */
    "playback"?: boolean;
    /** Receives the typing being played again by the controller, which is what `v-model:playback` binds. */
    "onUpdate:playback"?: (isPlaying: boolean) => void;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    "onMount"?: (controller: TypewriterController) => void;
    /** Runs once a playing run has every character in place. Moving `progress` to the end from outside does not. */
    "onAnimationEnd"?: () => void;
};

export type TypewriterSlots = {
    /** The text to type, with whatever markup, links and images it carries. It is measured, then redrawn. */
    default?: () => VNodeChild;
    /**
     * Draws a caret after the character that arrived most recently, or before the one leaving while erasing.
     * It is placed from the same progress the characters are drawn from, so it cannot drift from the text, and
     * it follows the text onto the next line. It is drawn again at every step, so a blink restarts
     * per character and reads as solid while typing. Meant for in-order weights: with a scatter it jumps to
     * wherever the last arrival was. It takes inline space and is decoration, so keep it narrow and mark it
     * `aria-hidden="true"`.
     */
    renderCaret: () => VNodeChild;
};
