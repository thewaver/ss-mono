import type { SwipeDirection } from "@thewaver/ss-utils";

import type { InteractionDragRatio } from "../../Abstracts/InteractionTracker/InteractionTracker.types";

export type CardStackPileSide = "top" | "bottom";

export type CardStackCardState<T> = {
    /** The card's own value, straight from `cards`. */
    card: T;
    /** Where the card sits in `cards`, which does not change as the ones above it leave. */
    index: number;
    /** How far down the pile the card is right now. Zero is the one on top. */
    depth: number;
    /** Whether this is the card a gesture would move. */
    isTop: boolean;
    /**
     * How far the card has been pushed, signed, as a share of the stack's own width and height. Zero on every
     * card but the one being pushed, so a painter can tilt or tint from it without checking the depth first.
     */
    travel: InteractionDragRatio;
    /**
     * Which way the card is on its way out, or `undefined` while it is still in the pile. It is set for the
     * length of one transition, which is the window a painter has to fade the card or spin it.
     */
    leavingTo: SwipeDirection | undefined;
    /**
     * Which side a recalled card is about to come back from, or `undefined` otherwise. It is set only for the
     * moment the card sits off to the side it left by, before it starts back, so whatever a painter draws for
     * it is the pose the card returns from — the reverse of `leavingTo`, which is the pose it leaves toward.
     */
    returningFrom: SwipeDirection | undefined;
};

export type CardStackMotion = {
    /** How far the top card has been pushed, signed, as a share of the stack's own width and height. */
    travel: InteractionDragRatio;
    /** Which way the top card is on its way out, for the length of one transition. */
    leavingTo: SwipeDirection | undefined;
    /** Which side a recalled card is about to come back from, for the moment it sits there. */
    returningFrom: SwipeDirection | undefined;
};

export type CardStackPileDefs<T> = {
    getCards: () => T[];
    getTopIndex: () => number;
    setTopIndex: (index: number) => void;
    getIsDisabled: () => boolean;
    getAllowedDirections: () => SwipeDirection[];
    getTransitionDurationMs: () => number;
    onSend?: (direction: SwipeDirection, card: T, index: number) => void;
    onEmpty?: () => void;
    batch?: (commit: () => void) => void;
};
