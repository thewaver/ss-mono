import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GestureUtils } from "@thewaver/ss-utils";

import { FLIPBOOK_DEFAULTS } from "./Flipbook.const";
import { FlipbookUtils } from "./Flipbook.utils";

const TWELVE = 12;
const ELEVEN = 11;

describe("FlipbookUtils spreads and pages", () => {
    it("opens a book of twelve pages at seven spreads, the two covers alone at either end", () => {
        expect(FlipbookUtils.getSpreadCount(TWELVE)).toBe(7);
        expect(FlipbookUtils.getSpreadPages(0, TWELVE), "the front cover alone on the right").toEqual({
            left: undefined,
            right: 0,
        });
        expect(FlipbookUtils.getSpreadPages(6, TWELVE), "the back cover alone on the left").toEqual({
            left: 11,
            right: undefined,
        });
    });

    it("puts the pages read on the left and the next on the right, two to a spread", () => {
        expect(FlipbookUtils.getSpreadPages(1, TWELVE)).toEqual({ left: 1, right: 2 });
        expect(FlipbookUtils.getSpreadPages(3, TWELVE)).toEqual({ left: 5, right: 6 });
        expect(FlipbookUtils.getShowingPages(3, TWELVE), "in reading order").toEqual([5, 6]);
        expect(FlipbookUtils.getShowingPages(0, TWELVE)).toEqual([0]);
    });

    it("ends an odd book on its last two pages, since the last leaf is never turned", () => {
        expect(FlipbookUtils.getLastSpread(ELEVEN)).toBe(5);
        expect(FlipbookUtils.getSpreadPages(5, ELEVEN)).toEqual({ left: 9, right: 10 });
        expect(FlipbookUtils.getLeafCount(ELEVEN)).toBe(6);
        expect(FlipbookUtils.getLeafPage(5, "back", ELEVEN), "the last leaf's back is blank").toBeUndefined();
    });

    it("finds every page on the spread that shows it, and on its own side", () => {
        for (let page = 0; page < TWELVE; page++) {
            const spread = FlipbookUtils.getPageSpread(page);
            const { left, right } = FlipbookUtils.getSpreadPages(spread, TWELVE);

            expect(FlipbookUtils.getIsPageShowing(page, spread)).toBe(true);
            expect(FlipbookUtils.getPageSide(page) === "left" ? left : right).toBe(page);
        }
    });

    it("prints a leaf's front and back as consecutive pages, the back read on the left", () => {
        expect(FlipbookUtils.getLeafPage(2, "front", TWELVE)).toBe(4);
        expect(FlipbookUtils.getLeafPage(2, "back", TWELVE)).toBe(5);
        expect(FlipbookUtils.getPageSide(4)).toBe("right");
        expect(FlipbookUtils.getPageSide(5)).toBe("left");
    });

    it("holds a spread past either end, since a book does not loop", () => {
        expect(FlipbookUtils.clampSpread(-3, TWELVE)).toBe(0);
        expect(FlipbookUtils.clampSpread(40, TWELVE)).toBe(6);
        expect(FlipbookUtils.clampSpread(2.4, TWELVE)).toBe(2);
    });

    it("is a book shut on nothing when it has no pages", () => {
        expect(FlipbookUtils.getSpreadCount(0)).toBe(1);
        expect(FlipbookUtils.getShowingPages(0, 0)).toEqual([]);
    });
});

describe("FlipbookUtils.getLeafFaceDefs", () => {
    const label = (page: number, count: number) => `page ${page + 1} of ${count}`;

    it("names each page on its own and keeps only the two the book is open at in reach", () => {
        expect(FlipbookUtils.getLeafFaceDefs(1, "back", TWELVE, 2, label)).toEqual({
            ariaLabel: "page 4 of 12",
            isHidden: false,
        });
        expect(FlipbookUtils.getLeafFaceDefs(2, "front", TWELVE, 2, label).isHidden).toBe(false);
        expect(FlipbookUtils.getLeafFaceDefs(1, "front", TWELVE, 2, label).isHidden, "turned away").toBe(true);
        expect(FlipbookUtils.getLeafFaceDefs(2, "back", TWELVE, 2, label).isHidden, "not turned to yet").toBe(true);
        expect(FlipbookUtils.getLeafFaceDefs(4, "front", TWELVE, 2, label).isHidden, "under the pile").toBe(true);
    });

    it("keeps the blank back of an odd book's last leaf out of reach and unnamed", () => {
        expect(FlipbookUtils.getLeafFaceDefs(5, "back", ELEVEN, 5, label)).toEqual({ ariaLabel: "", isHidden: true });
    });

    it("tells a page's painter which side it lies on and whether it is showing", () => {
        expect(FlipbookUtils.getPageState(3, TWELVE, 2)).toEqual({
            index: 3,
            count: TWELVE,
            side: "left",
            isShowing: true,
        });
        expect(FlipbookUtils.getPageState(6, TWELVE, 2).isShowing).toBe(false);
    });
});

describe("FlipbookUtils steps and keys", () => {
    it("steps one spread either way and refuses at both ends", () => {
        expect(FlipbookUtils.getStepTarget("next", 2, TWELVE)).toBe(3);
        expect(FlipbookUtils.getStepTarget("previous", 2, TWELVE)).toBe(1);

        expect(FlipbookUtils.getIsStepDisabled("previous", 0, TWELVE, false), "back from the front cover").toBe(true);
        expect(FlipbookUtils.getIsStepDisabled("next", 6, TWELVE, false), "on past the back cover").toBe(true);
        expect(FlipbookUtils.getIsStepDisabled("next", 0, TWELVE, false)).toBe(false);
        expect(FlipbookUtils.getIsStepDisabled("next", 0, TWELVE, true), "nothing turns a disabled book").toBe(true);
    });

    it("turns back on the left arrow and on with the right, and leaves every other key alone", () => {
        expect(FlipbookUtils.getKeyStep("ArrowLeft")).toBe("previous");
        expect(FlipbookUtils.getKeyStep("ArrowRight")).toBe("next");
        expect(FlipbookUtils.getKeyStep("ArrowUp")).toBeUndefined();
        expect(FlipbookUtils.getKeyStep("Enter")).toBeUndefined();
    });

    it("announces a change of spread, and not the book's first appearance", () => {
        expect(FlipbookUtils.getIsAnnounced(undefined, 0)).toBe(false);
        expect(FlipbookUtils.getIsAnnounced(0, 0)).toBe(false);
        expect(FlipbookUtils.getIsAnnounced(0, 1)).toBe(true);
    });
});

describe("FlipbookUtils dragging a page", () => {
    it("takes a drag only beside the step controls that stand in for it, and only with something to turn", () => {
        expect(FlipbookUtils.getIsDragDisabled(true, false, TWELVE)).toBe(false);
        expect(FlipbookUtils.getIsDragDisabled(false, false, TWELVE), "no controls drawn").toBe(true);
        expect(FlipbookUtils.getIsDragDisabled(true, true, TWELVE), "disabled").toBe(true);
        expect(FlipbookUtils.getIsDragDisabled(true, false, 1), "a cover alone").toBe(true);
    });

    it("follows the pointer one leaf at a time, leftwards turning forward", () => {
        expect(FlipbookUtils.getDragPosition(2, -0.3, TWELVE)).toBeCloseTo(2.3);
        expect(FlipbookUtils.getDragPosition(2, 0.3, TWELVE)).toBeCloseTo(1.7);
        expect(FlipbookUtils.getDragPosition(2, -1.8, TWELVE), "never more than one leaf over").toBe(3);
    });

    it("goes nowhere past either cover", () => {
        expect(FlipbookUtils.getDragPosition(0, 0.4, TWELVE)).toBe(0);
        expect(FlipbookUtils.getDragPosition(6, -0.4, TWELVE)).toBe(6);
    });

    it("turns the page over when let go past the commit point, and lets it fall back short of it", () => {
        const releaseAt = (index: number, progressRatio: number) =>
            FlipbookUtils.getReleaseSpread(
                index,
                GestureUtils.computeSwipeDirection(progressRatio, "horizontal", FLIPBOOK_DEFAULTS.commitRatio),
                TWELVE,
            );
        const past = FLIPBOOK_DEFAULTS.commitRatio * 1.5;
        const short = FLIPBOOK_DEFAULTS.commitRatio * 0.5;

        expect(releaseAt(2, -past), "past it to the left turns on").toBe(3);
        expect(releaseAt(2, past), "past it to the right turns back").toBe(1);
        expect(releaseAt(2, -short), "short of it falls back").toBe(2);
        expect(releaseAt(0, past), "past it, but back from the front cover, falls back").toBe(0);
    });
});

describe("FlipbookUtils.createBook", () => {
    beforeEach(() => {
        let now = 0;

        vi.useFakeTimers();
        vi.stubGlobal("performance", { now: () => now });
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
            setTimeout(() => {
                now += 100;
                callback(now);
            }, 0),
        );
        vi.stubGlobal("cancelAnimationFrame", (handle: ReturnType<typeof setTimeout>) => clearTimeout(handle));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const create = (opts: { index?: number; durationMs?: number; isDisabled?: boolean } = {}) => {
        let index = opts.index ?? 0;
        const writes: number[] = [];
        const book = FlipbookUtils.createBook({
            getPageCount: () => TWELVE,
            getIndex: () => index,
            setIndex: (next) => {
                index = next;
                writes.push(next);
            },
            getIsDisabled: () => opts.isDisabled ?? false,
            getTransitionDurationMs: () => opts.durationMs ?? 0,
        });

        return { book, writes, getIndex: () => index };
    };

    it("is drawn at the spread it is open at", () => {
        expect(create({ index: 3 }).book.position.get()).toBe(3);
    });

    it("writes the spread a turn asks for, and refuses at the ends or while disabled", () => {
        const { book, writes } = create();

        expect(book.turn("previous")).toBe(false);
        expect(book.turn("next")).toBe(true);
        expect(writes).toEqual([1]);

        expect(create({ isDisabled: true }).book.turn("next")).toBe(false);
    });

    it("glides from wherever it is drawn, and lands on the spread", () => {
        const { book } = create({ durationMs: 400 });
        const seen: number[] = [];

        book.position.subscribe(() => seen.push(book.position.get()));
        book.glideTo(3);
        vi.runAllTimers();

        expect(book.position.get()).toBe(3);
        expect(seen.length, "over several frames rather than one jump").toBeGreaterThan(1);
        expect(seen.every((position, index) => index === 0 || position >= seen[index - 1])).toBe(true);
    });

    it("jumps when the turn takes no time", () => {
        const { book } = create();

        book.glideTo(5);

        expect(book.position.get()).toBe(5);
    });

    it("follows a drag, then falls back from where the page was when it fell short", () => {
        const { book, writes } = create({ index: 2 });

        book.push(-0.1);
        expect(book.position.get()).toBeCloseTo(2.1);

        book.release(undefined);

        expect(writes, "nothing was written").toEqual([]);
        expect(book.position.get()).toBe(2);
    });

    it("writes the next spread when a drag let go committed, and leaves the glide to the spread's change", () => {
        const { book, writes } = create({ index: 2 });

        book.push(-0.4);
        book.release("left");

        expect(writes).toEqual([3]);
        expect(book.position.get(), "still where the page was let go").toBeCloseTo(2.4);
    });

    it("lets the page fall back when the drag committed past an end", () => {
        const { book, writes } = create({ index: 0 });

        book.release("right");

        expect(writes).toEqual([]);
        expect(book.position.get()).toBe(0);
    });

    it("stops where it is and redraws at the spread it is open at", () => {
        const { book } = create({ index: 1, durationMs: 400 });

        book.glideTo(4);
        book.stop();
        vi.runAllTimers();

        expect(book.position.get()).toBe(1);
    });
});
