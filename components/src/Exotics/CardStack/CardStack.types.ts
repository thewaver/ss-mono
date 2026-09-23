import type { Accessor, JSX } from "solid-js";

import type { SwipeDirection } from "@thewaver/ss-utils";

import type { InteractionDragRatio } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

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
};

export type CardStackControls = {
    /** Which card is on top, as an index into `cards`. It reaches the card count once the pile is empty. */
    getTopIndex: Accessor<number>;
    /** Whether every card has gone. */
    getIsEmpty: Accessor<boolean>;
    /**
     * Sends the top card away, as a press or a key would.
     *
     * @param direction Which way it leaves.
     * @returns `false` when the pile is empty or a card is already on its way out.
     */
    send: (direction: SwipeDirection) => boolean;
    /**
     * Puts every card back on the pile.
     *
     * @returns `false` when none had left.
     */
    deal: () => boolean;
};

export type CardStackProps<T> = AccessorProps<{
    /**
     * How far a card must be pushed before it leaves rather than springing back, as a share of the stack's own
     * size. It is measured along whichever axis the push traveled furthest.
     */
    commitRatio?: number;
    /** How long a card takes to fly out, and how long one that fell short takes to settle back. */
    transitionDurationMs?: number;
    /**
     * How many cards are in the document at once, counting the top one. The rest of the pile is not rendered,
     * so a deck of a thousand costs the same as a deck of three.
     */
    mountedCount?: number;
    /**
     * How far apart the cards in the pile sit, in pixels.
     *
     * The whole pile fits the stack's box rather than spilling out of it: a card is as tall as the box less
     * the room the lift needs, which is `(mountedCount - 1) * cardGap`, and the bottom-most card sits flush
     * with the bottom of the box. Raising this makes the pile deeper and every card shorter. It is the
     * stack's number rather than the painter's because a painter is handed one card and cannot know how many
     * others there are.
     */
    cardGap?: number;
    /**
     * How much narrower each card is than the one in front of it, as a share of the stack's width per step.
     *
     * It is what gives the pile its funnel: the top card is the widest and fills the box, `0.08` takes eight
     * percent off the one behind it and sixteen off the one behind that. `0` stacks cards of equal width. A
     * card narrowed past nothing is held at nothing rather than turning inside out.
     */
    funnelRatio?: number;
    /** Turns the stack off, so no card moves by gesture, key or control. */
    isDisabled?: boolean;
    /** Names the stack for assistive technology. */
    ariaLabel: string;
    /** Names one card, so a reader hears what it is rather than group. The index counts from zero. */
    computeCardLabel: (card: T, index: number) => string;
    /**
     * What the stack is called when it is announced, so a reader hears card stack rather than group. Defaults to
     * "card stack".
     */
    roleDescription?: string;
    /** What one card is called when it is announced, so a reader hears card rather than group. Defaults to "card". */
    cardRoleDescription?: string;
}> & {
    /** The cards, top of the pile first. */
    cards: MaybeAccessor<T[]>;
    /**
     * Which card is on top, as an index into `cards`. It is the only thing that moves the pile on, and setting
     * it to the card count empties the stack.
     */
    topIndexSignal?: SignalSource<number>;
    /** Draws one card, and is told where it sits and what is being done to it. */
    renderCard: (getState: Accessor<CardStackCardState<T>>) => JSX.Element;
    /** Runs when a card leaves, whichever route sent it. */
    onSend?: (direction: SwipeDirection, card: T, index: number) => void;
    /** Runs when the last card has gone. */
    onEmpty?: () => void;
    /**
     * Hands the consumer the controls once the stack is up, for driving it from outside.
     *
     * **Anything that sends a card without a drag has to be built on these.** The stack renders the pile and
     * nothing else, so the buttons belong to whoever is drawing the page and may sit anywhere on it. That
     * matters beyond layout: a swipe is a path-based gesture, so WCAG 2.5.1 and, because it is a drag, 2.5.7
     * both ask for a route that is a single pointer and not a drag, and a keyboard does not satisfy either —
     * both are about pointers. `send` is that route, and wiring it up is the consumer's to do.
     */
    onMount?: (controls: CardStackControls) => void;
};
