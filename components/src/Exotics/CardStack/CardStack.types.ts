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

export type BaseCardStackValues<T> = {
    /**
     * How far a card must be pushed before it leaves rather than springing back, as a share of the stack's own size.
     * It is measured along whichever axis the push traveled furthest.
     */
    commitRatio?: number;
    /** How long a card takes to fly out, and how long one that fell short takes to settle back. */
    transitionDurationMs?: number;
    /**
     * How many cards are in the document at once, counting the top one. The rest of the pile is not rendered, so a
     * deck of a thousand costs the same as a deck of three.
     */
    mountedCount?: number;
    /**
     * How far apart the cards in the pile sit, in pixels.
     *
     * The whole pile fits the stack's box rather than spilling out of it: a card is as tall as the box less the room
     * the lift needs, which is `(mountedCount - 1) * cardGap`, and the card furthest down the pile sits flush with the
     * edge `pileSide` names. Raising this makes the pile deeper and every card shorter. It is the stack's number rather
     * than the painter's because a painter is handed one card and cannot know how many others there are.
     */
    cardGap?: number;
    /**
     * How much narrower each card is than the one in front of it, as a share of the stack's width per step.
     *
     * It is what gives the pile its funnel: the top card is the widest and fills the box, `0.08` takes eight percent
     * off the one behind it and sixteen off the one behind that. `0` stacks cards of equal width. A card narrowed past
     * nothing is held at nothing rather than turning inside out.
     */
    funnelRatio?: number;
    /**
     * The edge the cards behind the top one peek out of. `"bottom"` sits the top card flush with the top of the box
     * and lets the pile show beneath it; `"top"` sits it flush with the bottom and lets the pile show above it.
     */
    pileSide?: CardStackPileSide;
    /**
     * Which ways a card may be sent. All four by default.
     *
     * A direction left out is refused by every route: a swipe that way springs back, its arrow key does nothing and
     * lets the page scroll, and `send` returns `false`. When the ones left in share one axis the stack claims only
     * that axis, so a touch screen can still scroll the page along the other; with both axes in play it claims both,
     * and the page cannot be flicked from on top of the stack.
     */
    allowedDirections?: SwipeDirection[];
    /** Turns the stack off, so no card moves by gesture, key or control. */
    isDisabled?: boolean;
    /** Names the stack for assistive technology. */
    ariaLabel: string;
    /**
     * What the stack is called when it is announced, so a reader hears card stack rather than group. Defaults to
     * "card stack".
     */
    roleDescription?: string;
    /** What one card is called when it is announced, so a reader hears card rather than group. Defaults to "card". */
    cardRoleDescription?: string;
    /** The cards, top of the pile first. */
    cards: T[];
};

export type BaseCardStackCbs<T> = {
    /** Names one card, so a reader hears what it is rather than group. The index counts from zero. */
    computeCardLabel: (card: T, index: number) => string;
    /** Runs when a card leaves, whichever route sent it. */
    onSend?: (direction: SwipeDirection, card: T, index: number) => void;
    /** Runs when the last card has gone. */
    onEmpty?: () => void;
};

export type BaseCardStackProps<T> = BaseCardStackValues<T> & BaseCardStackCbs<T>;
