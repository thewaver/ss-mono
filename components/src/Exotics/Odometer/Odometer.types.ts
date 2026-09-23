import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type OdometerSlotKind = "digit" | "fixed";

export type OdometerSlot = {
    kind: OdometerSlotKind;
    character: string;
    digitIndex: number;
};

export type OdometerDirection = "up" | "down" | "same";

export type OdometerSlotPhase = "entering" | "shown" | "leaving";

export type OdometerShownSlot<S> = {
    slot: S;
    phase: OdometerSlotPhase;
};

export type OdometerReel = {
    /** How many whole turns the column makes on top of the ones it needs, before it settles on its digit. */
    extraTurns: number;
    /** How long the column takes to settle, its extra turns included. */
    durationMs: number;
};

export type OdometerSlotFlags = {
    /** Whether the slot has just appeared and is still growing to its full width. */
    isEntering: boolean;
    /** Whether the slot is on its way out and is shrinking to nothing before it is removed. */
    isLeaving: boolean;
};

export type OdometerProps = AccessorProps<{
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
    /**
     * Draws one turning digit. It is told whether its column is growing in or shrinking away, so it can fade or
     * scale while the width changes.
     */
    renderDigit?: (getDigit: Accessor<string>, getFlags: Accessor<OdometerSlotFlags>) => JSX.Element;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderDigit` is.
     */
    renderFixed?: (getCharacter: Accessor<string>, getFlags: Accessor<OdometerSlotFlags>) => JSX.Element;
}>;
