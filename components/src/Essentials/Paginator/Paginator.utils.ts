import { MathUtils } from "@thewaver/ss-utils";

import type { PaginatorEntry, PaginatorRange, PaginatorStep } from "./Paginator.types";

/** Pages are numbered from one, as the user sees them. */
const FIRST_PAGE = 1;

/** The whole numbers from one bound to the other, both included, or nothing when they cross. */
const getRange = (from: number, to: number) =>
    from > to ? [] : Array.from({ length: to - from + 1 }, (_, index) => from + index);

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
}
