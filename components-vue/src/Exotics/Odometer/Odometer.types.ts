import type { VNodeChild } from "vue";

import type { OdometerReel, OdometerSlotFlags } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type OdometerProps = {
    /** The text the digits should settle on. Changing it is what starts them turning. */
    text: string;
    /** How large one digit is. */
    digitSize: Size2d;
    /**
     * How long one digit takes to turn from its old face to its new one. It is also how long a slot takes to
     * grow in or shrink away when the number gains or loses a character.
     */
    turnDurationMs?: number;
    /**
     * How long each digit waits after the one beside it starts, which is what makes the turn ripple along.
     * Ignored while `computeReel` is given.
     */
    cascadeDelayMs?: number;
    /** Names the odometer for assistive technology, so a reader hears the value rather than the separate digits. */
    ariaLabel?: string;
    /**
     * Turns every column into a slot-machine reel. Asked once per column each time the number changes, it says
     * how many whole turns that column makes before settling and how long it takes, which is where a stagger
     * comes from — the columns all start together and stop in the order their durations give. Every column
     * spins, including one whose digit is unchanged; nothing spins when no digit changed. It replaces the
     * ripple `cascadeDelayMs` would give. For a visitor who has asked for less motion the extra turns are
     * dropped and each column turns only as far as its digit needs.
     */
    computeReel?: (digitIndex: number, digitCount: number) => OdometerReel;
};

export type OdometerSlots = {
    /**
     * Draws one turning digit. It is told whether its column is growing in or shrinking away, so it can fade or
     * scale while the width changes. Left out, the digit is drawn as plain text.
     */
    renderDigit: (props: { digit: string; flags: OdometerSlotFlags }) => VNodeChild;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderDigit` is. Left out, the character is drawn as plain text.
     */
    renderFixed: (props: { character: string; flags: OdometerSlotFlags }) => VNodeChild;
};
