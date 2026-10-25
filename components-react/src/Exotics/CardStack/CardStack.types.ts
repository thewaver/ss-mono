import type { ReactNode } from "react";

import type { BaseCardStackProps, CardStackCardState } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

export type CardStackControls = {
    /** Which card is on top, as an index into `cards`. It reaches the card count once the pile is empty. */
    getTopIndex: () => number;
    /** Whether every card has gone. */
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
    /**
     * Calls `listener` whenever what the getters report has changed, until the returned function is called. The
     * getters answer with what the stack last drew, so this and one getter are what `useSyncExternalStore` takes —
     * which is how a consumer's send and recall buttons follow the pile.
     */
    subscribe: (listener: () => void) => () => void;
};

export type CardStackProps<T> = BaseCardStackProps<T> & {
    /**
     * Which card is on top, as an index into `cards`. It is the only thing that moves the pile on, and setting it to
     * the card count empties the stack. Left out, the stack keeps its own.
     */
    topIndex?: readonly [number, (index: number) => void];
    /** Draws one card, and is told where it sits and what is being done to it. */
    renderCard: (state: CardStackCardState<T>) => ReactNode;
    /**
     * Hands the consumer the controls once the stack is up, for driving it from outside.
     *
     * **Anything that sends a card without a drag has to be built on these.** The stack renders the pile and nothing
     * else, so the buttons belong to whoever is drawing the page and may sit anywhere on it. That matters beyond
     * layout: a swipe is a path-based gesture, so
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html WCAG 2.5.1} and, because it is a drag,
     * {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html 2.5.7} both ask for a route that is a
     * single pointer and not a drag, and a keyboard does not satisfy either — both are about pointers. `send` is that
     * route, and wiring it up is the consumer's to do.
     */
    onMount?: (controls: CardStackControls) => void;
};
