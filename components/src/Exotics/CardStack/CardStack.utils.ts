import {
    GestureUtils,
    type Point2d,
    type Store,
    StoreUtils,
    type SwipeAxis,
    type SwipeDirection,
} from "@thewaver/ss-utils";

import type { InteractionDragRatio } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { CardStackMotion, CardStackPileDefs, CardStackPileSide } from "./CardStack.types";

/** The top card's depth. */
const TOP_DEPTH = 0;
/** One card, or one step down the pile. */
const SINGLE = 1;
/** The index of the first card. */
const FIRST_INDEX = 0;
/** A card's full width, as a share of the stack's. */
const FULL_WIDTH = 1;
/** The narrowest a card is ever drawn, as a share of the stack's width. */
const NO_WIDTH = 0;
/** Shares are written as percentages. */
const PERCENT = 100;
/** A transition that does not run. */
const NO_DURATION = 0;
/** How far out a card flies when it leaves, in widths or heights of the stack. */
const LEAVE_RATIO = 1.5;
/** The frames a recalled card sits at its side before it starts back: one to be drawn there, one to be read there. */
const RETURN_FRAMES = 2;

/** No push at all. */
const NO_TRAVEL: InteractionDragRatio = { x: 0, y: 0 };

/** Where a card that leaves each way ends up, in widths and heights of the stack. */
const LEAVE_OFFSETS: Record<SwipeDirection, Point2d> = {
    left: { x: -LEAVE_RATIO, y: 0 },
    right: { x: LEAVE_RATIO, y: 0 },
    up: { x: 0, y: -LEAVE_RATIO },
    down: { x: 0, y: LEAVE_RATIO },
};

/** Which way each arrow key sends the top card. */
const KEY_DIRECTIONS: Record<string, SwipeDirection | undefined> = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
};

/** Whether two motion snapshots say the same thing, so a write that changes nothing notifies nobody. */
const getIsSameMotion = (first: CardStackMotion, second: CardStackMotion) =>
    first.travel.x === second.travel.x &&
    first.travel.y === second.travel.y &&
    first.leavingTo === second.leavingTo &&
    first.returningFrom === second.returningFrom;

/**
 * The part of a card stack that is not about drawing it: which cards are mounted, the pile's geometry, which swipe
 * tracker it needs, and the pile itself — sending, recalling and dealing, with the flight timers behind them.
 *
 * The stack owns the pile's shape and the card's motion; the consumer owns which card is on top and what a card
 * looks like. Both frameworks' stacks call these, so a card leaves by the same rules whatever draws it.
 */
export namespace CardStackUtils {
    /**
     * The one axis the allowed directions share, which decides the swipe tracker.
     *
     * @param directions The directions a card may be sent.
     * @returns The axis when every direction lies on it, so the stack claims only that one and leaves the other to
     * the browser to scroll; `undefined` when both axes are in play, or when none is.
     */
    export const getSwipeAxis = (directions: SwipeDirection[]): SwipeAxis | undefined => {
        const axes = new Set(directions.map(GestureUtils.computeSwipeAxis));

        return axes.size === SINGLE ? [...axes][0] : undefined;
    };

    /**
     * The cards in the document right now, top first, each with its index in `cards`.
     *
     * @param cards Every card, top of the pile first.
     * @param topIndex Which card is on top.
     * @param mountedCount How many cards are drawn at once, counting the top one.
     */
    export const getMounted = <T>(cards: T[], topIndex: number, mountedCount: number) => {
        const from = Math.max(topIndex, FIRST_INDEX);

        return cards.slice(from, from + mountedCount).map((card, offset) => ({ card, index: from + offset }));
    };

    /**
     * How much of the box the lift of the pile takes, which every card gives up in height.
     *
     * @param mountedCount How many cards are drawn at once.
     * @param cardGap How far apart the cards sit, in pixels.
     */
    export const getPileExtentPx = (mountedCount: number, cardGap: number) => (mountedCount - SINGLE) * cardGap;

    /**
     * A card's height, as CSS: the box less the room the pile's lift needs.
     *
     * @param pileExtentPx From {@link getPileExtentPx}.
     */
    export const getCardHeight = (pileExtentPx: number) => `calc(${PERCENT}% - ${pileExtentPx}px)`;

    /**
     * A card's width, as CSS: the top card fills the box, and each one behind it narrows by the funnel.
     *
     * @param depth How far down the pile the card is.
     * @param funnelRatio How much narrower each card is than the one in front, as a share of the stack's width.
     * @returns A percentage, never below nothing, since a negative width is an inverted card rather than a small one.
     */
    export const getCardWidth = (depth: number, funnelRatio: number) =>
        `${Math.max(FULL_WIDTH - depth * funnelRatio, NO_WIDTH) * PERCENT}%`;

    /**
     * How far down the box a card sits, in pixels, before any push.
     *
     * The card furthest down the pile sits flush with the edge the pile peeks out of, and each card nearer the top is
     * moved one gap towards the other edge, so with every card mounted the top card sits flush with that other edge.
     * With fewer cards mounted the pile keeps its far end where it was and the top card stops short.
     *
     * @param depth How far down the pile the card is.
     * @param opts.mountedLength How many cards are mounted right now.
     * @param opts.pileExtentPx From {@link getPileExtentPx}.
     * @param opts.cardGap How far apart the cards sit, in pixels.
     * @param opts.pileSide The edge the cards behind the top one peek out of.
     */
    export const getCardOffsetPx = (
        depth: number,
        opts: { mountedLength: number; pileExtentPx: number; cardGap: number; pileSide: CardStackPileSide },
    ) => {
        const fromFarEnd = (opts.mountedLength - SINGLE - depth) * opts.cardGap;

        return opts.pileSide === "top" ? fromFarEnd : opts.pileExtentPx - fromFarEnd;
    };

    /**
     * A card's transform: moved into its place in the pile, and for the top card pushed or flown as well.
     *
     * The place comes from {@link getCardOffsetPx}. The top card follows the push while it is in the pile, and sits at
     * the away pose while it is leaving or about to return — travel arrives as a share of the card, so the flight is in
     * percentages whatever the box is.
     *
     * @param depth How far down the pile the card is.
     * @param opts.mountedLength How many cards are mounted right now.
     * @param opts.pileExtentPx From {@link getPileExtentPx}.
     * @param opts.cardGap How far apart the cards sit, in pixels.
     * @param opts.pileSide The edge the cards behind the top one peek out of.
     * @param opts.getMotion Reads the top card's push and flight. Called only for the top card, so a view that follows
     * what it reads leaves every card below the top out of the push, which changes on each pointer move.
     */
    export const getCardTransform = (
        depth: number,
        opts: {
            mountedLength: number;
            pileExtentPx: number;
            cardGap: number;
            pileSide: CardStackPileSide;
            getMotion: () => CardStackMotion;
        },
    ) => {
        const stacked = `translateY(${getCardOffsetPx(depth, opts)}px)`;

        if (depth !== TOP_DEPTH) return stacked;

        const motion = opts.getMotion();
        const away = motion.leavingTo ?? motion.returningFrom;
        const offset = away === undefined ? motion.travel : LEAVE_OFFSETS[away];

        return `translate(${offset.x * PERCENT}%, ${offset.y * PERCENT}%) ${stacked}`;
    };

    /**
     * How long a card's move takes. The top card follows the pointer without lag while it is swiped, and jumps to its
     * side before a recall; everything else eases over the stack's duration.
     *
     * @param depth How far down the pile the card is.
     * @param opts.getIsSwiping Reads whether a swipe is under way. Called only for the top card.
     * @param opts.getMotion Reads the top card's push and flight. Called only for the top card, and only when no swipe
     * is under way.
     * @param opts.durationMs The stack's transition duration.
     */
    export const getCardTransitionDurationMs = (
        depth: number,
        opts: { getIsSwiping: () => boolean; getMotion: () => CardStackMotion; durationMs: number },
    ) =>
        depth === TOP_DEPTH && (opts.getIsSwiping() || opts.getMotion().returningFrom !== undefined)
            ? NO_DURATION
            : opts.durationMs;

    /**
     * Which way an arrow key sends the top card.
     *
     * @param key The `key` of the keyboard event.
     * @returns The direction, or `undefined` for a key that is not an arrow.
     */
    export const getKeyDirection = (key: string) => KEY_DIRECTIONS[key];

    /**
     * What one card's painter is told about the push and the flight, which only the top card ever has.
     *
     * @param isTop Whether the card is on top.
     * @param getMotion Reads the top card's push and flight. Called only when the card is on top.
     */
    export const getCardMotion = (isTop: boolean, getMotion: () => CardStackMotion): CardStackMotion =>
        isTop ? getMotion() : { travel: NO_TRAVEL, leavingTo: undefined, returningFrom: undefined };

    /**
     * The pile: how far the top card is pushed and whether it is flying, and the commands that send, recall and deal.
     *
     * A card is sent by one route and leaves by one path: the gesture, the arrow keys and the consumer's controls all
     * call `send`, so the flight, the callback and the advance happen once and in one order. Nothing starts while a
     * card is still moving, out or back. The stack remembers which way each card left, by its index, so a recalled
     * card returns from that side; one moved past by setting the top index has no side and reappears in place.
     *
     * @param defs The stack's state and answers, read when a command runs. The top index is the consumer's, handed
     * over as a getter and a setter.
     * @returns `motion`, a store of the top card's push and flight that ignores writes that change nothing; `send`,
     * `recall` and `deal`; `push` and `release` for the swipe tracker to call; and `stop`, which clears the timers and
     * puts the top card back at rest, so the pile is usable again when a component is mounted a second time.
     */
    export const createPile = <T>(defs: CardStackPileDefs<T>) => {
        const motion = StoreUtils.create<CardStackMotion>(
            { travel: NO_TRAVEL, leavingTo: undefined, returningFrom: undefined },
            { isEqual: getIsSameMotion },
        );
        const departures = new Map<number, SwipeDirection>();

        let leaveTimeout: ReturnType<typeof setTimeout> | undefined;
        let returnFrame: ReturnType<typeof requestAnimationFrame> | undefined;

        const commit = (write: () => void) => (defs.batch ? defs.batch(write) : write());

        const cancelReturn = () => {
            if (returnFrame !== undefined) cancelAnimationFrame(returnFrame);

            returnFrame = undefined;
        };

        const getIsMoving = () => motion.get().leavingTo !== undefined || motion.get().returningFrom !== undefined;

        const send = (direction: SwipeDirection) => {
            const cards = defs.getCards();
            const index = defs.getTopIndex();

            if (defs.getIsDisabled() || getIsMoving() || index >= cards.length) return false;
            if (!defs.getAllowedDirections().includes(direction)) return false;

            const card = cards[index]!;

            motion.set({ travel: NO_TRAVEL, leavingTo: direction, returningFrom: undefined });

            clearTimeout(leaveTimeout);

            leaveTimeout = setTimeout(() => {
                leaveTimeout = undefined;
                departures.set(index, direction);

                motion.set({ ...motion.get(), leavingTo: undefined });
                defs.setTopIndex(index + SINGLE);

                defs.onSend?.(direction, card, index);

                if (index + SINGLE >= defs.getCards().length) defs.onEmpty?.();
            }, defs.getTransitionDurationMs());

            return true;
        };

        const recall = () => {
            const previous = Math.min(defs.getTopIndex(), defs.getCards().length) - SINGLE;

            if (defs.getIsDisabled() || getIsMoving() || previous < FIRST_INDEX) return false;

            const direction = departures.get(previous);

            departures.delete(previous);

            const isFlying = direction !== undefined && defs.getTransitionDurationMs() !== NO_DURATION;

            commit(() => {
                motion.set({
                    travel: NO_TRAVEL,
                    leavingTo: undefined,
                    returningFrom: isFlying ? direction : undefined,
                });
                defs.setTopIndex(previous);
            });

            if (!isFlying) return true;

            let framesLeft = RETURN_FRAMES;

            const step = () => {
                framesLeft -= SINGLE;

                if (framesLeft > NO_DURATION) {
                    returnFrame = requestAnimationFrame(step);

                    return;
                }

                returnFrame = undefined;
                motion.set({ ...motion.get(), returningFrom: undefined });
            };

            returnFrame = requestAnimationFrame(step);

            return true;
        };

        const deal = () => {
            if (defs.getTopIndex() === FIRST_INDEX && !getIsMoving()) return false;

            clearTimeout(leaveTimeout);
            leaveTimeout = undefined;
            cancelReturn();
            departures.clear();

            commit(() => {
                motion.set({ travel: NO_TRAVEL, leavingTo: undefined, returningFrom: undefined });
                defs.setTopIndex(FIRST_INDEX);
            });

            return true;
        };

        return {
            motion: motion as Store<CardStackMotion>,
            send,
            recall,
            deal,
            push: (travel: InteractionDragRatio) => motion.set({ ...motion.get(), travel }),
            release: (direction: SwipeDirection | undefined) => {
                motion.set({ ...motion.get(), travel: NO_TRAVEL });

                if (direction !== undefined) send(direction);
            },
            stop: () => {
                clearTimeout(leaveTimeout);
                leaveTimeout = undefined;
                cancelReturn();
                motion.set({ travel: NO_TRAVEL, leavingTo: undefined, returningFrom: undefined });
            },
        };
    };
}
