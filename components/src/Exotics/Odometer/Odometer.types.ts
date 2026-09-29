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

export type OdometerFixedSlot = {
    /** The character the slot shows. */
    character: string;
    /** Where the slot sits among all the slots, which is the CSS `order` it is drawn with. */
    order: number;
};

export type OdometerDigitSlot = {
    /** Where the slot sits among all the slots, which is the CSS `order` it is drawn with. */
    order: number;
    /** Which digit this is, counting only digits. */
    digitIndex: number;
};

export type OdometerTurn = {
    /** The angle each column is drawn at, a leaving column's included. */
    angles: number[];
    /** How long each column waits before it turns. */
    delays: number[];
    /** How long each column takes to turn, where a reel says; otherwise the odometer's own duration. */
    durations: (number | undefined)[];
    /** The digit each column now shows, a leaving column's included. */
    columnDigits: number[];
};
