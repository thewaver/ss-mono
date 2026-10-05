import type { VNodeChild } from "vue";

import type { SlotTextLetterRoute, SlotTextMechanism, SlotTextReel, SlotTextSlotFlags } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type SlotTextProps = {
    /** The text the columns should settle on. Changing it is what starts them turning. */
    text: string;
    /** How large one character is, turning or not. */
    characterSize: Size2d;
    /**
     * How long one column takes to turn from its old character to its new one. It is also how long a slot takes to
     * grow in or shrink away when the text gains or loses a character.
     */
    turnDurationMs?: number;
    /**
     * How long each column waits after the turning column beside it starts, which is what makes the turn ripple
     * along. Ignored while `computeReel` is given.
     */
    turnDelayMs?: number;
    /**
     * How a column changes from one character to the next. `"drum"`, the default, turns it like a drum with the
     * characters round its rim. `"splitFlap"` drops one flap after another, as a departures board does: each flap is
     * half a character hinged on the middle line, its front the top half of the character going and its back the
     * bottom half of the character coming. Either way a column passes through every character between the old one
     * and the new one, and `turnDurationMs`, `turnDelayMs` and `computeReel` mean the same. The character is still
     * drawn whole; a split-flap shows the halves of that drawing it needs.
     */
    mechanism?: SlotTextMechanism;
    /**
     * The characters a letter column holds, in the order they sit round it — `" ABCDEFGHIJKLMNOPQRSTUVWXYZ"` turns
     * capitals and spaces. A character of the text found here gets a column of its own that turns through them;
     * one that is not, a separator or a letter nobody listed, stays put. Digits always turn, round the ten digits,
     * whatever this holds. Left empty, the default, only digits turn. Padding words to one length with a listed
     * space keeps every column turning in place, where words of different lengths grow and shrink slots.
     */
    letters?: string;
    /**
     * Which way round a letter column turns. `"forward"`, the default, always goes on round `letters`, as a
     * departures board does, so C to Z passes every letter between — in the same `turnDurationMs`, so a long way
     * round is a faster riffle rather than a longer one. `"shortest"` takes the nearer way, so C to Z goes back three.
     * Digits ignore it: they turn the way their number goes, which is part of what the number says.
     */
    letterRoute?: SlotTextLetterRoute;
    /** Names the slot text for assistive technology, so a reader hears the text rather than the separate columns. */
    ariaLabel?: string;
    /**
     * Turns every column into a slot-machine reel. Asked once per turning column each time the text changes, it says
     * how many whole turns that column makes before settling and how long it takes, which is where a stagger
     * comes from — the columns all start together and stop in the order their durations give. Every column
     * spins, including one whose character is unchanged; nothing spins when nothing changed. It replaces the
     * ripple `turnDelayMs` would give. For a visitor who has asked for less motion the extra turns are
     * dropped and each column turns only as far as its character needs.
     */
    computeReel?: (wheelIndex: number, wheelCount: number) => SlotTextReel;
};

export type SlotTextSlots = {
    /**
     * Draws one character on a turning column. It is told whether its column is growing in or shrinking away, so it
     * can fade or scale while the width changes. Left out, the character is drawn as plain text.
     */
    renderTurning: (props: { character: string; flags: SlotTextSlotFlags }) => VNodeChild;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderTurning` is. Left out, the character is drawn as plain text.
     */
    renderFixed: (props: { character: string; flags: SlotTextSlotFlags }) => VNodeChild;
};
