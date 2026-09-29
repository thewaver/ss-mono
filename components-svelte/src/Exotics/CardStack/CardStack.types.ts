import type { Snippet } from "svelte";

import type { CardStackCardState } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

export type CardStackControls = {
    /**
     * Which card is on top, as an index into `cards`. It reaches the card count once the pile is empty. Read inside an
     * effect, a `$derived` or markup, it is followed as the pile moves, which is how a consumer's send and recall
     * buttons keep up with it.
     */
    getTopIndex: () => number;
    /** Whether every card has gone. Followed the same way as `getTopIndex`. */
    getIsEmpty: () => boolean;
    /**
     * Sends the top card away, as a press or a key would.
     *
     * @param direction Which way it leaves.
     * @returns `false` when the pile is empty, the direction is not among `allowedDirections`, or a card is already
     * on its way out or back.
     */
    send: (direction: SwipeDirection) => boolean;
    /**
     * Brings the last card that left back onto the top of the pile, returning from the side it left by.
     *
     * A card that was moved past by setting `topIndex` rather than sent has no side to come back from, so it
     * reappears in place.
     *
     * @returns `false` when no card has left yet, the stack is disabled, or a card is already on its way out or back.
     */
    recall: () => boolean;
    /**
     * Puts every card back on the pile.
     *
     * @returns `false` when none had left.
     */
    deal: () => boolean;
};

export type CardStackProps<T> = {
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
     * the lift needs, which is `(mountedCount - 1) * cardGap`, and the bottom-most card sits flush with the bottom of
     * the box. Raising this makes the pile deeper and every card shorter. It is the stack's number rather than the
     * painter's because a painter is handed one card and cannot know how many others there are.
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
    /** Names one card, so a reader hears what it is rather than group. The index counts from zero. */
    computeCardLabel: (card: T, index: number) => string;
    /**
     * What the stack is called when it is announced, so a reader hears card stack rather than group. Defaults to
     * "card stack".
     */
    roleDescription?: string;
    /** What one card is called when it is announced, so a reader hears card rather than group. Defaults to "card". */
    cardRoleDescription?: string;
    /** The cards, top of the pile first. */
    cards: T[];
    /**
     * Which card is on top, as an index into `cards`. Bind it with `bind:topIndex` to drive or follow it: it is the
     * only thing that moves the pile on, and setting it to the card count empties the stack. Left unbound, the stack
     * keeps its own, starting at the first card.
     */
    topIndex?: number;
    /** Draws one card, and is told where it sits and what is being done to it. */
    renderCard: Snippet<[state: CardStackCardState<T>]>;
    /** Runs when a card leaves, whichever route sent it. */
    onSend?: (direction: SwipeDirection, card: T, index: number) => void;
    /** Runs when the last card has gone. */
    onEmpty?: () => void;
    /**
     * Hands the consumer the controls once the stack is up, for driving it from outside.
     *
     * **Anything that sends a card without a drag has to be built on these.** The stack renders the pile and nothing
     * else, so the buttons belong to whoever is drawing the page and may sit anywhere on it. That matters beyond
     * layout: a swipe is a path-based gesture, so WCAG 2.5.1 and, because it is a drag, 2.5.7 both ask for a route
     * that is a single pointer and not a drag, and a keyboard does not satisfy either — both are about pointers.
     * `send` is that route, and wiring it up is the consumer's to do.
     */
    onMount?: (controls: CardStackControls) => void;
};
