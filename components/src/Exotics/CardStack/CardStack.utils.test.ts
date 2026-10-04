import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SwipeDirection } from "@thewaver/ss-utils";

import { CardStackUtils } from "./CardStack.utils";

const REST = { travel: { x: 0, y: 0 }, leavingTo: undefined, returningFrom: undefined };

describe("getSwipeAxis", () => {
    it("claims one axis when every direction lies on it, and none otherwise", () => {
        expect(CardStackUtils.getSwipeAxis(["left", "right"])).toBe("horizontal");
        expect(CardStackUtils.getSwipeAxis(["up"])).toBe("vertical");
        expect(CardStackUtils.getSwipeAxis(["left", "up"])).toBe(undefined);
        expect(CardStackUtils.getSwipeAxis([])).toBe(undefined);
    });
});

describe("getMounted", () => {
    it("takes the mounted count from the top, each card keeping its index", () => {
        expect(CardStackUtils.getMounted(["a", "b", "c", "d"], 1, 2)).toEqual([
            { card: "b", index: 1 },
            { card: "c", index: 2 },
        ]);
        expect(CardStackUtils.getMounted(["a"], 1, 2)).toEqual([]);
    });
});

describe("the pile's geometry", () => {
    it("gives up the lift in height and narrows each card behind by the funnel, never below nothing", () => {
        expect(CardStackUtils.getCardHeight(CardStackUtils.getPileExtentPx(5, 4))).toBe("calc(100% - 16px)");
        expect(CardStackUtils.getCardWidth(2, 0.25)).toBe("50%");
        expect(CardStackUtils.getCardWidth(5, 0.25)).toBe("0%");
    });

    it("sits the bottom card flush and lifts each one above it by a gap", () => {
        const opts = {
            mountedLength: 3,
            pileExtentPx: 8,
            cardGap: 4,
            pileSide: "bottom" as const,
            getMotion: () => REST,
        };

        expect(CardStackUtils.getCardTransform(2, opts)).toBe("translateY(8px)");
        expect(CardStackUtils.getCardTransform(1, opts)).toBe("translateY(4px)");
        expect(CardStackUtils.getCardTransform(0, opts)).toBe("translate(0%, 0%) translateY(0px)");
    });

    it("piled toward the top, mirrors the pile: the far card flush with the top, the top card flush with the bottom", () => {
        const opts = { mountedLength: 3, pileExtentPx: 8, cardGap: 4, pileSide: "top" as const };

        expect(CardStackUtils.getCardOffsetPx(2, opts)).toBe(0);
        expect(CardStackUtils.getCardOffsetPx(1, opts)).toBe(4);
        expect(CardStackUtils.getCardOffsetPx(0, opts)).toBe(8);
    });

    it("keeps the pile's far end in place as cards run out, on either side", () => {
        const opts = { mountedLength: 2, pileExtentPx: 8, cardGap: 4 };

        expect(CardStackUtils.getCardOffsetPx(1, { ...opts, pileSide: "bottom" })).toBe(8);
        expect(CardStackUtils.getCardOffsetPx(1, { ...opts, pileSide: "top" })).toBe(0);
    });

    it("pushes only the top card, and flies it out a width and a half", () => {
        const leaving = {
            mountedLength: 1,
            pileExtentPx: 0,
            cardGap: 4,
            pileSide: "bottom" as const,
            getMotion: () => ({ ...REST, leavingTo: "left" as const }),
        };

        expect(CardStackUtils.getCardTransform(0, leaving)).toBe("translate(-150%, 0%) translateY(0px)");
    });

    it("runs the top card's move with no transition while it is swiped or about to return", () => {
        expect(
            CardStackUtils.getCardTransitionDurationMs(0, {
                getIsSwiping: () => true,
                getMotion: () => REST,
                durationMs: 250,
            }),
        ).toBe(0);
        expect(
            CardStackUtils.getCardTransitionDurationMs(1, {
                getIsSwiping: () => true,
                getMotion: () => REST,
                durationMs: 250,
            }),
        ).toBe(250);
    });
});

describe("createPile", () => {
    const TRANSITION_MS = 100;

    let topIndex = 0;
    const sent: Array<[SwipeDirection, string, number]> = [];

    const create = (allowed: SwipeDirection[] = ["left", "right", "up", "down"]) =>
        CardStackUtils.createPile<string>({
            getCards: () => ["a", "b", "c"],
            getTopIndex: () => topIndex,
            setTopIndex: (index) => {
                topIndex = index;
            },
            getIsDisabled: () => false,
            getAllowedDirections: () => allowed,
            getTransitionDurationMs: () => TRANSITION_MS,
            onSend: (direction, card, index) => sent.push([direction, card, index]),
        });

    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal("requestAnimationFrame", (callback: () => void) => setTimeout(callback, 16));
        vi.stubGlobal("cancelAnimationFrame", (handle: ReturnType<typeof setTimeout>) => clearTimeout(handle));
        topIndex = 0;
        sent.length = 0;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("flies the card out, then moves the pile on and reports it", () => {
        const pile = create();

        expect(pile.send("left")).toBe(true);
        expect(pile.motion.get().leavingTo).toBe("left");
        expect(pile.send("right"), "a second send waits for the first").toBe(false);

        vi.advanceTimersByTime(TRANSITION_MS);

        expect(topIndex).toBe(1);
        expect(pile.motion.get().leavingTo).toBe(undefined);
        expect(sent).toEqual([["left", "a", 0]]);
    });

    it("refuses a direction that is not allowed", () => {
        expect(create(["left", "right"]).send("up")).toBe(false);
    });

    it("recalls the last card from the side it left by, and then lets it go", () => {
        const pile = create();

        pile.send("up");
        vi.advanceTimersByTime(TRANSITION_MS);

        expect(pile.recall()).toBe(true);
        expect(topIndex).toBe(0);
        expect(pile.motion.get().returningFrom).toBe("up");

        vi.advanceTimersByTime(40);

        expect(pile.motion.get().returningFrom).toBe(undefined);
    });

    it("brings back a card moved past without a send in place, and deals everything back", () => {
        const pile = create();

        topIndex = 2;

        expect(pile.recall()).toBe(true);
        expect(pile.motion.get().returningFrom).toBe(undefined);
        expect(pile.deal()).toBe(true);
        expect(topIndex).toBe(0);
        expect(pile.deal(), "there is nothing left to deal").toBe(false);
    });

    it("follows the push and springs back on a release short of a direction", () => {
        const pile = create();

        pile.push({ x: 0.2, y: 0 });

        expect(pile.motion.get().travel).toEqual({ x: 0.2, y: 0 });

        pile.release(undefined);

        expect(pile.motion.get()).toEqual(REST);
    });

    it("puts a card in flight back at rest when stopped, so the pile can be used again", () => {
        const pile = create();

        pile.send("left");
        pile.stop();

        expect(pile.motion.get()).toEqual(REST);
        expect(pile.send("left")).toBe(true);
    });
});
