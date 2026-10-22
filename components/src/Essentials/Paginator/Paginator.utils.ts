import { MathUtils } from "@thewaver/ss-utils";

import type { PlacementLayout, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { PaginatorControlEntry } from "./Paginator.context.types";
import type { PaginatorEntry, PaginatorRange, PaginatorStep } from "./Paginator.types";

/** Pages are numbered from one, as the user sees them. */
const FIRST_PAGE = 1;

/** The fewest items a page can hold, whatever size was asked for. */
const MIN_PAGE_SIZE = 1;

/** What `indexOf` answers for an entry that is not in the list. */
const MISSING_ENTRY = -1;

/** A whole number of items, never below zero. */
const toItemCount = (itemCount: number) => Math.max(Math.trunc(itemCount), 0);

/** A whole page size, never below one. */
const toPageSize = (pageSize: number) => Math.max(Math.trunc(pageSize), MIN_PAGE_SIZE);

/** The whole numbers from one bound to the other, both included, or nothing when they cross. */
const getRange = (from: number, to: number) =>
    from > to ? [] : Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** The move controls that sit before the pages, in the order they are drawn. */
const LEADING_STEPS: PaginatorStep[] = ["first", "previous"];

/** The move controls that sit after the pages, in the order they are drawn. */
const TRAILING_STEPS: PaginatorStep[] = ["next", "last"];

/** Page numbers as page entries. */
const toPages = (pages: number[]): PaginatorEntry[] => pages.map((page) => ({ kind: "page", page }));

/**
 * What goes between two runs of pages.
 *
 * A span of one page is drawn as that page rather than as a gap, since an ellipsis hiding a single
 * page wastes the same room it saves.
 */
const bridge = (from: number, to: number): PaginatorEntry[] => {
    if (to < from) return [];
    if (to === from) return [{ kind: "page", page: from }];

    return [{ kind: "gap", from, to }];
};

/**
 * Works out which page numbers a pager shows, and where the gaps go.
 *
 * The shape is the familiar one: the first few pages, the last few, a window around the current
 * page, and an ellipsis wherever pages have been left out.
 */
export namespace PaginatorUtils {
    /**
     * The entries to draw for a given page.
     *
     * The window around the current page keeps its width as it approaches either end rather than
     * shrinking, so the control does not change size as the user pages through — the window slides up
     * against the boundary pages instead. Where the boundaries and the window would cover everything
     * anyway, every page is listed and no gaps appear.
     *
     * @param page The current page, counting from one. Clamped, so an out-of-range page is treated as
     * the nearest real one.
     * @param range.pageCount How many pages there are.
     * @param range.siblingCount How many pages to show either side of the current one.
     * @param range.boundaryCount How many pages to always show at each end.
     * @returns The entries in order, each either a page or a gap naming the range it hides — so a
     * caller can offer that range as a jump target. Empty when there are no pages.
     */
    export const getEntries = (page: number, range: PaginatorRange): PaginatorEntry[] => {
        const pageCount = Math.max(Math.trunc(range.pageCount), 0);

        if (pageCount < FIRST_PAGE) return [];

        const siblingCount = Math.max(Math.trunc(range.siblingCount), 0);
        const boundaryCount = Math.max(Math.trunc(range.boundaryCount), 0);
        const current = MathUtils.clamp(Math.trunc(page), FIRST_PAGE, pageCount);

        const startPages = getRange(FIRST_PAGE, Math.min(boundaryCount, pageCount));
        const endPages = getRange(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

        const firstFree = boundaryCount + 1;
        const lastFree = pageCount - boundaryCount;

        if (lastFree < firstFree) return toPages(getRange(FIRST_PAGE, pageCount));

        const width = siblingCount * 2 + 1;
        const siblingsStart = MathUtils.clamp(
            current - siblingCount,
            firstFree,
            Math.max(lastFree - width + 1, firstFree),
        );
        const siblingsEnd = Math.min(siblingsStart + width - 1, lastFree);

        return [
            ...toPages(startPages),
            ...bridge(firstFree, siblingsStart - 1),
            ...toPages(getRange(siblingsStart, siblingsEnd)),
            ...bridge(siblingsEnd + 1, lastFree),
            ...toPages(endPages),
        ];
    };

    /**
     * Which page a step control moves to.
     *
     * @param step `"first"`, `"previous"`, `"next"` or `"last"`.
     * @param page The current page.
     * @param pageCount How many pages there are.
     * @returns The page to go to, clamped to the range, so a step at either end stays put.
     */
    export const getStepTarget = (step: PaginatorStep, page: number, pageCount: number) => {
        const last = Math.max(Math.trunc(pageCount), FIRST_PAGE);
        const current = MathUtils.clamp(Math.trunc(page), FIRST_PAGE, last);

        if (step === "first") return FIRST_PAGE;
        if (step === "last") return last;

        return MathUtils.clamp(step === "previous" ? current - 1 : current + 1, FIRST_PAGE, last);
    };

    /**
     * How many pages a list of items fills.
     *
     * The last page holds whatever is left over, so 383 items at 20 a page is 20 pages, and an empty list has no
     * pages at all.
     *
     * @param itemCount How many items there are. A fraction is dropped and a negative count is treated as none.
     * @param pageSize How many items one page holds. A fraction is dropped and anything below one is treated as one.
     * @returns The whole number of pages, never below zero.
     */
    export const computePageCount = (itemCount: number, pageSize: number) =>
        Math.ceil(toItemCount(itemCount) / toPageSize(pageSize));

    /**
     * Which items one page shows, for a summary such as "showing 21 to 40 of 383".
     *
     * @param page The page, counting from one. Clamped, so an out-of-range page is treated as the nearest real one.
     * @param itemCount How many items there are.
     * @param pageSize How many items one page holds.
     * @returns `first` and `last`, the first and last item on the page counting from one, with `last` short on a short
     * last page; or `undefined` for an empty list, which has no page to show.
     */
    export const computeItemRange = (page: number, itemCount: number, pageSize: number) => {
        const count = toItemCount(itemCount);
        const size = toPageSize(pageSize);
        const pageCount = computePageCount(count, size);

        if (pageCount < FIRST_PAGE) return undefined;

        const current = MathUtils.clamp(Math.trunc(page), FIRST_PAGE, pageCount);
        const first = (current - FIRST_PAGE) * size + 1;

        return { first, last: Math.min(first + size - 1, count) };
    };

    /**
     * Sorts the requested move controls into the ones drawn before the pages and the ones drawn after.
     *
     * The order the caller listed them in does not matter: first always precedes previous, and next always precedes
     * last, so a paginator reads the same way whichever order its steps were written in.
     *
     * @param steps The move controls asked for.
     * @returns `leading`, the ones before the pages, and `trailing`, the ones after.
     */
    export const splitSteps = (steps: PaginatorStep[]) => ({
        leading: LEADING_STEPS.filter((step) => steps.includes(step)),
        trailing: TRAILING_STEPS.filter((step) => steps.includes(step)),
    });

    /**
     * Where a move control goes, and whether it can go there at all.
     *
     * A step that would land on the page already shown is disabled rather than hidden, so previous goes quiet on the
     * first page and next on the last, and the row keeps its shape. With no pages at all every step is disabled,
     * since there is nowhere to go.
     *
     * @param step Which move control.
     * @param page The current page.
     * @param pageCount How many pages there are.
     * @param isDisabled Whether the whole paginator is turned off, which disables every step whatever its target.
     * @returns `targetPage`, from {@link getStepTarget}, and `isDisabled`.
     */
    export const computeStepState = (step: PaginatorStep, page: number, pageCount: number, isDisabled: boolean) => {
        const targetPage = getStepTarget(step, page, pageCount);

        return { targetPage, isDisabled: isDisabled || pageCount < FIRST_PAGE || targetPage === page };
    };

    /**
     * The registered controls in the order they appear in the document.
     *
     * A paginator's controls come from several pieces arranged by the page, and register with the root as they are
     * made, so registration order says nothing certain about where each one sits; the document order is what a layout
     * follows and a reader walks. It can only be read once every control's element is in the document, since a
     * detached element has no position to compare, so until then the registration order stands and the caller sorts
     * again once the newcomers are in.
     *
     * @param entries The entries, in the order they registered.
     * @returns A new list in document order, or `entries` itself while any control's element is missing or detached.
     */
    export const orderEntries = (entries: PaginatorControlEntry[]) => {
        if (entries.some((entry) => !(entry.getElementRef()?.isConnected ?? false))) return entries;

        return [...entries].sort((a, b) =>
            a.getElementRef()!.compareDocumentPosition(b.getElementRef()!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
    };

    /**
     * Where a layout put one control.
     *
     * A layout places items by their position in the run, and a control's position is its place in document order,
     * whichever piece it belongs to.
     *
     * @param ordered The entries in document order, from {@link orderEntries}.
     * @param layout The root's layout, if it has one.
     * @param entry The control asking.
     * @returns Its placement, or `undefined` when the paginator is a plain row or the control has not registered.
     */
    export const computePlacement = (
        ordered: PaginatorControlEntry[],
        layout: PlacementLayout | undefined,
        entry: PaginatorControlEntry,
    ): PlacementRect | undefined => {
        const index = ordered.indexOf(entry);

        return index === MISSING_ENTRY ? undefined : layout?.placements[index];
    };

    /**
     * Where a placed control stacks, so a later one paints over an earlier one where a layout overlaps them.
     *
     * @param ordered The entries in document order.
     * @param entry The control asking.
     * @returns Its position counting from one, or `undefined` when it has not registered.
     */
    export const computeStackAt = (ordered: PaginatorControlEntry[], entry: PaginatorControlEntry) => {
        const index = ordered.indexOf(entry);

        return index === MISSING_ENTRY ? undefined : index + 1;
    };

    /**
     * Warns about a piece rendered outside any `PaginatorRoot`, where there is no item count or page to draw from.
     *
     * @param piece The piece's name, for the message.
     */
    export const warnOutsideRoot = (piece: string) => {
        console.warn(
            `${piece}: no PaginatorRoot around it — it has no item count or page to draw from and renders nothing. Render it inside a PaginatorRoot.`,
        );
    };
}
