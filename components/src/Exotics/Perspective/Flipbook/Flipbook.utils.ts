import { MathUtils, StoreUtils, type SwipeDirection } from "@thewaver/ss-utils";

import { CarouselUtils } from "../../../Essentials/Carousel/Carousel.utils";
import type { SpineFaceDefs } from "../../../Primitives/Spine/Spine.types";
import type {
    FlipbookBook,
    FlipbookBookDefs,
    FlipbookLeafFace,
    FlipbookPageState,
    FlipbookSide,
    FlipbookSpreadPages,
    FlipbookStep,
} from "./Flipbook.types";

/** The first spread, where the front cover lies alone on the right. */
const FIRST_SPREAD = 0;
/** The front cover. */
const FIRST_PAGE = 0;
/** Two pages to a leaf, front and back, and two to a spread, one either side of the spine. */
const PAGES_PER_LEAF = 2;
/** Half as many spreads and leaves as pages. */
const HALF = 0.5;
/** A leaf's front page is the first of its two. */
const FRONT_OFFSET = 0;
/** One step, one page, one spread or one leaf. */
const SINGLE = 1;

/** Which way each arrow key turns the book. */
const KEY_STEPS: Record<string, FlipbookStep | undefined> = {
    ArrowLeft: "previous",
    ArrowRight: "next",
};

/** Which way a drag that committed turns the book: dragging a page leftwards turns it over, as a hand does. */
const SWIPE_STEPS: Record<SwipeDirection, FlipbookStep | undefined> = {
    left: "next",
    right: "previous",
    up: undefined,
    down: undefined,
};

/**
 * The arithmetic behind `Flipbook`: which pages a spread shows, which leaf a page is printed on, where the book is
 * drawn while a page turns, and the book itself — turning, dragging and gliding from one spread to another.
 *
 * A book is a pile of leaves hinged on the spine. Leaf `n` carries page `2n` on its front and page `2n + 1` on its
 * back, so the front cover is the front of the first leaf and lies alone on the right while the book is shut, and
 * the back cover, when the page count is even, is the back of the last leaf and lies alone on the left once every
 * leaf has been turned. A spread is counted by how many leaves lie on the left.
 */
export namespace FlipbookUtils {
    /**
     * How many spreads a book of this many pages opens at, the two covers' included.
     *
     * @param pageCount How many pages there are.
     * @returns At least one, so a book with no pages is a book shut on nothing.
     */
    export const getSpreadCount = (pageCount: number) => Math.floor(Math.max(pageCount, 0) * HALF) + SINGLE;

    /**
     * The last spread a book of this many pages opens at: the back cover alone on the left when the count is even,
     * the last two pages when it is odd.
     */
    export const getLastSpread = (pageCount: number) => getSpreadCount(pageCount) - SINGLE;

    /**
     * Brings a spread into range, rounding a fraction to the nearest whole one. A book does not loop, so a spread
     * past either end is held there.
     */
    export const clampSpread = (index: number, pageCount: number) =>
        MathUtils.clamp(Math.round(index), FIRST_SPREAD, getLastSpread(pageCount));

    /**
     * How many leaves a book of this many pages is bound from. An odd count leaves the back of the last leaf blank,
     * and that leaf is never turned, so the blank is never shown.
     */
    export const getLeafCount = (pageCount: number) => Math.ceil(Math.max(pageCount, 0) * HALF);

    /**
     * The page printed on one side of a leaf.
     *
     * @param leaf Which leaf, counting from zero.
     * @param face Which side of it.
     * @param pageCount How many pages there are.
     * @returns The page's index, or `undefined` for the blank back of the last leaf of an odd count.
     */
    export const getLeafPage = (leaf: number, face: FlipbookLeafFace, pageCount: number) => {
        const page = leaf * PAGES_PER_LEAF + (face === "back" ? SINGLE : FRONT_OFFSET);

        return page < pageCount ? page : undefined;
    };

    /** Which side of the spine a page lies on when it is flat: an even page is a leaf's front, on the right. */
    export const getPageSide = (page: number): FlipbookSide =>
        page % PAGES_PER_LEAF === FRONT_OFFSET ? "right" : "left";

    /** The spread a page is seen at: page `0` alone at the first, then two pages to each spread after it. */
    export const getPageSpread = (page: number) => Math.floor((page + SINGLE) * HALF);

    /**
     * The pages a spread shows, one on each side of the spine.
     *
     * @param index Which spread, counting from zero.
     * @param pageCount How many pages there are.
     * @returns The page on each side, `undefined` where there is none: the left at the front cover, the right at the
     * back cover when the count is even.
     */
    export const getSpreadPages = (index: number, pageCount: number): FlipbookSpreadPages => {
        const right = index * PAGES_PER_LEAF;
        const left = right - SINGLE;

        return {
            left: left >= FIRST_PAGE && left < pageCount ? left : undefined,
            right: right < pageCount ? right : undefined,
        };
    };

    /**
     * The pages a spread shows, in reading order, which is what the spread is announced by.
     *
     * @param index Which spread, counting from zero.
     * @param pageCount How many pages there are.
     * @returns One page at either cover and two in between; none for a book with no pages.
     */
    export const getShowingPages = (index: number, pageCount: number) => {
        const { left, right } = getSpreadPages(index, pageCount);

        return [left, right].filter((page): page is number => page !== undefined);
    };

    /** Whether a page is one of those the book is open at. */
    export const getIsPageShowing = (page: number, index: number) => getPageSpread(page) === index;

    /**
     * What a page's painter is told about it.
     *
     * @param page Which page, counting from zero.
     * @param pageCount How many pages there are.
     * @param index The spread the book is open at.
     */
    export const getPageState = (page: number, pageCount: number, index: number): FlipbookPageState => ({
        index: page,
        count: pageCount,
        side: getPageSide(page),
        isShowing: getIsPageShowing(page, index),
    });

    /**
     * How one side of a leaf is named and whether it is in reach, for the spine the book is drawn on.
     *
     * Only the pages the book is open at are in reach; every other page, the ones covered as much as the ones turned
     * away, is hidden from assistive technology and taken out of the tab order. The blank back of the last leaf of an
     * odd count is never in reach and carries no name.
     *
     * @param leaf Which leaf, counting from zero.
     * @param face Which side of it.
     * @param pageCount How many pages there are.
     * @param index The spread the book is open at.
     * @param computePageLabel The consumer's name for a page.
     */
    export const getLeafFaceDefs = (
        leaf: number,
        face: FlipbookLeafFace,
        pageCount: number,
        index: number,
        computePageLabel: (page: number, count: number) => string,
    ): SpineFaceDefs => {
        const page = getLeafPage(leaf, face, pageCount);

        return page === undefined
            ? { ariaLabel: "", isHidden: true }
            : { ariaLabel: computePageLabel(page, pageCount), isHidden: !getIsPageShowing(page, index) };
    };

    /**
     * The spread a step control opens the book at.
     *
     * @param step Which way it turns.
     * @param index The spread the book is open at.
     * @param pageCount How many pages there are.
     * @returns The spread one further or one back, or the one already open at either end.
     */
    export const getStepTarget = (step: FlipbookStep, index: number, pageCount: number) =>
        clampSpread(index + (step === "next" ? SINGLE : -SINGLE), pageCount);

    /** Whether a step control is refused: the book is disabled, or already open at the end it turns towards. */
    export const getIsStepDisabled = (step: FlipbookStep, index: number, pageCount: number, isDisabled: boolean) =>
        isDisabled || getStepTarget(step, index, pageCount) === clampSpread(index, pageCount);

    /**
     * Which way an arrow key turns the book.
     *
     * @param key The `key` of the keyboard event.
     * @returns `previous` for the left arrow and `next` for the right, which is where the pages read and unread lie;
     * `undefined` for any other key, which the book leaves to the page.
     */
    export const getKeyStep = (key: string) => KEY_STEPS[key];

    /**
     * Which way a committed drag turns the book.
     *
     * @param direction The way the drag went, from the swipe tracker.
     * @returns `next` for a drag to the left, `previous` for one to the right, `undefined` for one that fell short.
     */
    export const getSwipeStep = (direction: SwipeDirection | undefined) =>
        direction === undefined ? undefined : SWIPE_STEPS[direction];

    /**
     * Whether a page can be dragged.
     *
     * A drag is a dragging movement, so it needs a single-pointer alternative, and the step controls are that
     * alternative: a book drawn without them is one the consumer turns from elsewhere, and it takes no drags either.
     *
     * @param hasControls Whether the consumer draws the step controls.
     * @param isDisabled Whether the book is disabled.
     * @param pageCount How many pages there are; a book that opens at one spread has nothing to turn.
     */
    export const getIsDragDisabled = (hasControls: boolean, isDisabled: boolean, pageCount: number) =>
        !hasControls || isDisabled || getSpreadCount(pageCount) <= SINGLE;

    /**
     * Where the book is drawn while a page follows the pointer.
     *
     * Dragging the book's full width turns one leaf all the way over, so the page moves as far as the pointer does.
     * Only one leaf turns at a time, so the position is held within a spread either side of the one open, and a drag
     * past the first or last spread goes nowhere.
     *
     * @param index The spread the book is open at.
     * @param progressRatio How far the pointer has traveled, as a signed share of the book's width: negative to the
     * left, which turns forward.
     * @param pageCount How many pages there are.
     */
    export const getDragPosition = (index: number, progressRatio: number, pageCount: number) => {
        const current = clampSpread(index, pageCount);

        return MathUtils.clamp(
            current - progressRatio,
            Math.max(current - SINGLE, FIRST_SPREAD),
            Math.min(current + SINGLE, getLastSpread(pageCount)),
        );
    };

    /**
     * The spread a drag opens the book at when it is let go.
     *
     * @param index The spread the book is open at.
     * @param direction The way the drag committed, or `undefined` when it fell short of the commit point, in which
     * case the page falls back.
     * @param pageCount How many pages there are.
     */
    export const getReleaseSpread = (index: number, direction: SwipeDirection | undefined, pageCount: number) => {
        const step = getSwipeStep(direction);

        return step === undefined ? clampSpread(index, pageCount) : getStepTarget(step, index, pageCount);
    };

    /**
     * Whether a change of spread is announced: every change is, the book's first appearance is not.
     *
     * @param previous The spread announced or shown last, `undefined` before the first.
     * @param index The spread now open.
     */
    export const getIsAnnounced = (previous: number | undefined, index: number) =>
        previous !== undefined && previous !== index;

    /**
     * The book: where it is drawn, and the commands that turn it.
     *
     * Every turn ends the same way, whether a step control, an arrow key, a drag or a write from outside asked for it:
     * the spread is written, and the view hands the new spread to `glideTo`, which turns the pages from wherever they
     * are drawn. So a drag let go past the commit point carries on from where the page was, one that fell short falls
     * back from there, and a jump of several spreads turns each leaf in turn rather than all at once.
     *
     * @param defs The book's state and answers, read when a command runs. The spread is the consumer's, handed over as
     * a getter and a setter.
     * @returns The book, drawn at the spread it is open at.
     */
    export const createBook = (defs: FlipbookBookDefs): FlipbookBook => {
        const getCurrent = () => clampSpread(defs.getIndex(), defs.getPageCount());

        const position = StoreUtils.create(getCurrent());

        let stopGlide: (() => void) | undefined;

        const cancelGlide = () => {
            stopGlide?.();
            stopGlide = undefined;
        };

        const glideTo = (index: number) => {
            const from = position.get();
            const to = clampSpread(index, defs.getPageCount());

            cancelGlide();

            stopGlide = CarouselUtils.glide({
                from,
                to,
                durationMs: defs.getTransitionDurationMs(),
                onFrame: (next) => position.set(next),
                onEnd: () => position.set(to),
            });
        };

        const turn = (step: FlipbookStep) => {
            const pageCount = defs.getPageCount();
            const current = getCurrent();

            if (getIsStepDisabled(step, current, pageCount, defs.getIsDisabled())) return false;

            defs.setIndex(getStepTarget(step, current, pageCount));

            return true;
        };

        const push = (progressRatio: number) => {
            cancelGlide();
            position.set(getDragPosition(defs.getIndex(), progressRatio, defs.getPageCount()));
        };

        const release = (direction: SwipeDirection | undefined) => {
            const pageCount = defs.getPageCount();
            const current = getCurrent();
            const target = getReleaseSpread(current, direction, pageCount);

            if (defs.getIsDisabled() || target === current) {
                glideTo(current);

                return;
            }

            defs.setIndex(target);
        };

        const stop = () => {
            cancelGlide();
            position.set(getCurrent());
        };

        return { position, turn, glideTo, push, release, stop };
    };
}
