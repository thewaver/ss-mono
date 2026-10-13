import type { JSX } from "solid-js";

import type { BaseTypewriterCbs, BaseTypewriterValues, TypewriterController } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type TypewriterProps = AccessorValues<BaseTypewriterValues> &
    BaseTypewriterCbs & {
        /**
         * Draws a caret after the character that arrived most recently, or before the one leaving while erasing.
         * It is placed from the same progress the characters are drawn from, so it cannot drift from the text, and
         * it follows the text onto the next line. It is drawn again at every step, so a blink restarts
         * per character and reads as solid while typing. Meant for in-order weights: with a scatter it jumps to
         * wherever the last arrival was. It takes inline space and is decoration, so keep it narrow and mark it
         * `aria-hidden="true"`.
         */
        renderCaret?: () => JSX.Element;
        /**
         * How far the typing has gone, `0` for nothing yet and `1` for every character in place.
         *
         * While it plays, the typewriter writes it as it goes. With `playback` off, writing it draws that moment of the
         * run: every character's keyframes are held at the matching point, so a moment can fall partway through one
         * character's own animation, and a character not yet reached shows its animation's first frame. That is what
         * lets a scroll position or a song's current time drive the text. A change to the text or its layout sends it
         * back to `0` only while playing.
         */
        progress?: SignalSource<number>;
        /**
         * Whether the typing plays on its own. It stays on once a run has ended, which is what lets a change of text play
         * the typing in again; a consumer driving `progress` from outside turns it off.
         */
        playback?: SignalSource<boolean>;
        /** Hands the consumer a controller once the text is up, for replaying it from outside. */
        onMount?: (controller: TypewriterController) => void;
    };
