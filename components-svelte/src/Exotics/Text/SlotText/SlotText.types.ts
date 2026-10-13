import type { Snippet } from "svelte";

import type { BaseSlotTextProps, SlotTextSlotFlags, SlotTextSlotPhase } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type SlotTextProps = BaseSlotTextProps & {
    /**
     * Draws one character on a turning column. It is told whether its column is growing in or shrinking away, so it
     * can fade or scale while the width changes.
     */
    renderTurning?: Snippet<[character: string, flags: SlotTextSlotFlags]>;
    /**
     * Draws one character that does not turn, such as a separator. It is told whether the slot is growing in or
     * shrinking away, as `renderTurning` is.
     */
    renderFixed?: Snippet<[character: string, flags: SlotTextSlotFlags]>;
};

export type SlotTextSlotProps = {
    /** Whether the slot is growing in, shown, or shrinking away. A change of it starts the width animation. */
    phase: SlotTextSlotPhase;
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

export type SlotTextFlapColumnProps = {
    /** The position the column runs to, counted in flaps. A change of it starts the flaps falling. */
    target: number;
    /** How long the column waits before its first flap falls. */
    delayMs: number;
    /** How long the column takes from its first flap starting to its last one landing. */
    durationMs: number;
    /** The characters round the column, in order, which the flaps carry. */
    faces: string[];
    /** How large one character is, which every flap fills. */
    characterSize: Size2d;
    /** Draws one whole character, of which the column shows a half on each side of a flap. */
    renderCharacter: Snippet<[character: string]>;
};
