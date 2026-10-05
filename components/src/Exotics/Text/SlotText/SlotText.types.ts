import type { Store } from "@thewaver/ss-utils";

export type SlotTextSlotKind = "digit" | "letter" | "fixed";

export type SlotTextMechanism = "drum" | "splitFlap";

export type SlotTextLetterRoute = "forward" | "shortest";

export type SlotTextSlot = {
    kind: SlotTextSlotKind;
    character: string;
    wheelIndex: number;
};

export type SlotTextWheel = {
    /** The characters round the column, in order: the ten digits, or the letters the consumer listed. */
    faces: string[];
    /** Which of `faces` the column shows. */
    face: number;
    /** Whether the column is a digit, which is what puts it under the number's direction and carrying. */
    isDigit: boolean;
};

export type SlotTextDirection = "up" | "down" | "same";

export type SlotTextSlotPhase = "entering" | "shown" | "leaving";

export type SlotTextShownSlot<S> = {
    slot: S;
    phase: SlotTextSlotPhase;
};

export type SlotTextReel = {
    /** How many whole turns the column makes on top of the ones it needs, before it settles on its character. */
    extraTurns: number;
    /** How long the column takes to settle, its extra turns included. */
    durationMs: number;
};

export type SlotTextSlotFlags = {
    /** Whether the slot has just appeared and is still growing to its full width. */
    isEntering: boolean;
    /** Whether the slot is on its way out and is shrinking to nothing before it is removed. */
    isLeaving: boolean;
};

export type SlotTextFixedSlot = {
    /** The character the slot shows. */
    character: string;
    /** Where the slot sits among all the slots, which is the CSS `order` it is drawn with. */
    order: number;
};

export type SlotTextTurningSlot = {
    /** Where the slot sits among all the slots, which is the CSS `order` it is drawn with. */
    order: number;
    /** Which turning column this is, counting only the slots that turn. */
    wheelIndex: number;
};

export type SlotTextTurn = {
    /** The angle each column is drawn at, a leaving column's included. */
    angles: number[];
    /** How long each column waits before it turns. */
    delays: number[];
    /** How long each column takes to turn, where a reel says; otherwise the slot text's own duration. */
    durations: (number | undefined)[];
    /** What each column now shows, a leaving column's included. */
    columnWheels: SlotTextWheel[];
};

export type SlotTextFlapLeaf = {
    /** The character whose top half the flap carries on its front. */
    front: string;
    /** The character whose bottom half the flap carries on its back, the one after `front`. */
    back: string;
};

export type SlotTextFlapWindow = {
    /**
     * The three flaps a column draws, in order: the one that fell last, lying below the middle line with the bottom
     * half of the character on show; the one on show, upright or falling; and the next one, standing behind it.
     */
    leaves: SlotTextFlapLeaf[];
    /** Where among `leaves` the column stands, `1` with the middle flap upright and nearly `2` as it lands. */
    position: number;
};

export type SlotTextFlapper = Store<number> & {
    /**
     * Runs the column from the position drawn now to `target`, one flap after another, after waiting `delayMs`,
     * so that the last flap lands `durationMs` after the first one starts. A run under way is replaced from where
     * it had reached. Asking for the position already drawn, with nothing running, does nothing.
     */
    flapTo: (target: number, delayMs: number, durationMs: number) => void;
    /** Stops any run under way and puts the column straight on `position`. */
    rest: (position: number) => void;
    /** Stops any run under way, leaving the column wherever it had reached. */
    stop: () => void;
};
