import type { Snippet } from "svelte";

import type { OdometerMechanism, OdometerReel, OdometerSlotFlags, OdometerSlotPhase } from "@thewaver/ss-components";
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
    /**
     * How a column changes from one digit to the next. `"drum"`, the default, turns it like a drum with the digits
     * round its rim. `"splitFlap"` drops one flap after another, as a departures board does: each flap is half a
     * character hinged on the middle line, its front the top half of the digit going and its back the bottom half
     * of the digit coming. Either way a column passes through every digit between the old one and the new one, and
     * `turnDurationMs`, `cascadeDelayMs` and `computeReel` mean the same. The digit is still drawn whole; a
     * split-flap shows the halves of that drawing it needs.
     */
    mechanism?: OdometerMechanism;
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
    /**
     * Draws one turning digit. It is told whether its column is growing in or shrinking away, so it can fade or
     * scale while the width changes.
     */
    renderDigit?: Snippet<[digit: string, flags: OdometerSlotFlags]>;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderDigit` is.
     */
    renderFixed?: Snippet<[character: string, flags: OdometerSlotFlags]>;
};

export type OdometerSlotProps = {
    /** Whether the slot is growing in, shown, or shrinking away. A change of it starts the width animation. */
    phase: OdometerSlotPhase;
    /** The width the slot grows to when shown, in pixels. */
    widthPx: number;
    /** How long growing in or shrinking away takes. */
    durationMs: number;
    /** The slot's classes. */
    class: string;
    /** The slot's inline style. */
    style: string;
    /** Hides the slot from assistive technology, for a character the value's own text already carries. */
    isHidden?: boolean;
    /** Runs once the slot has finished growing in. */
    onGrown: () => void;
    /** Runs once the slot has finished shrinking away. */
    onShrunk: () => void;
    /** What the slot holds. */
    children: Snippet;
};

export type OdometerFlapColumnProps = {
    /** The position the column runs to, counted in flaps. A change of it starts the flaps falling. */
    target: number;
    /** How long the column waits before its first flap falls. */
    delayMs: number;
    /** How long the column takes from its first flap starting to its last one landing. */
    durationMs: number;
    /** How large one character is, which every flap fills. */
    digitSize: Size2d;
    /** Draws one whole character, of which the column shows a half on each side of a flap. */
    renderCharacter: Snippet<[character: string]>;
};
