import type { Size2d, Store } from "@thewaver/ss-utils";

export type SlotTextSlotKind = "digit" | "letter" | "fixed";

export type SlotTextMechanism = "drum" | "split_flap";

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

export type BaseSlotTextValues = {
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
     * characters round its rim. `"split_flap"` drops one flap after another, as a departures board does: each flap is
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
};

export type BaseSlotTextCbs = {
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

export type BaseSlotTextProps = BaseSlotTextValues & BaseSlotTextCbs;
