import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";

import { createVirtualizer, defaultRangeExtractor, measureElement } from "@tanstack/solid-virtual";

import type { VirtualizerRowWindow, VirtualizerRowWindowOpts } from "./Virtualizer.types";

/** The `overflow` values that make an element a scroller. */
const SCROLLING_OVERFLOWS = new Set(["auto", "scroll", "overlay"]);

/**
 * Draws only the rows of a long list that are on screen.
 *
 * A thin layer over `@tanstack/solid-virtual`, adding what this library's lists need: finding the
 * scrolling ancestor rather than being told about it, so a list can be dropped into any scroller;
 * correcting for the list not starting at the top of that scroller; and keeping pinned rows drawn
 * however far away they are.
 */
export namespace VirtualizerUtils {
    /**
     * Finds the nearest ancestor that actually scrolls vertically.
     *
     * @param getRef The element to search up from.
     * @param getIsEnabled Pass `false` to stop looking.
     * @returns The scroller, or `undefined` when there is none — which is the signal that virtualising
     * cannot work here and every row should be drawn.
     */
    export const createScrollParent = (getRef: Accessor<HTMLElement | undefined>, getIsEnabled: Accessor<boolean>) => {
        const [getScrollParent, setScrollParent] = createSignal<HTMLElement>();

        createEffect(() => {
            const ref = getRef();

            if (!ref || !getIsEnabled()) {
                setScrollParent(undefined);

                return;
            }

            let element = ref.parentElement;

            while (element) {
                if (SCROLLING_OVERFLOWS.has(getComputedStyle(element).overflowY)) break;

                element = element.parentElement;
            }

            setScrollParent(element ?? undefined);
        });

        return getScrollParent;
    };

    /**
     * Works out which rows to draw, and how to place them.
     *
     * The list does not have to start at the top of its scroller — there may be a header, or other
     * content above it — so the distance between the two is measured and taken off every position. That
     * measurement also allows for a scroller drawn under a CSS transform, where the rectangle on screen
     * and the element's own height disagree.
     *
     * Everything falls back safely: with no scrolling ancestor or with virtualising switched off,
     * `getIsLive` reports `false` and the caller should draw the whole list.
     *
     * @param getRef The list's own element.
     * @param getCount How many rows there are.
     * @param opts.getIsEnabled Whether to virtualise at all.
     * @param opts.computeEstimatedSize A row's likely height, used before it has been measured. Being
     * wrong only costs a scrollbar that settles as rows are measured.
     * @param opts.getPinnedRows Rows to keep drawn wherever the scroll is — a selected row that must
     * stay measurable, a row being dragged.
     * @param opts.getOverscan How many extra rows to draw beyond the visible ones, to cover a fast
     * scroll.
     * @returns `getIsLive` for whether virtualising is in effect, `getRows` and `getTotalSize` for what
     * to draw and how tall to make the spacer, `getRowStart` for a row's position, `measureRow` to
     * attach to each row's element so its real height is learnt, and `scrollToRow`.
     */
    export const createRowWindow = (
        getRef: Accessor<HTMLElement | undefined>,
        getCount: Accessor<number>,
        opts: VirtualizerRowWindowOpts,
    ): VirtualizerRowWindow => {
        const getScrollParent = createScrollParent(getRef, opts.getIsEnabled);

        const [getScrollMargin, setScrollMargin] = createSignal(0);

        createEffect(() => {
            const ref = getRef();
            const scrollParent = getScrollParent();

            if (!ref || !scrollParent) {
                setScrollMargin(0);

                return;
            }

            const scrollParentRect = scrollParent.getBoundingClientRect();
            const scale = scrollParent.offsetHeight ? scrollParentRect.height / scrollParent.offsetHeight : 1;
            const inset = (ref.getBoundingClientRect().top - scrollParentRect.top) / (scale || 1);

            setScrollMargin(inset - scrollParent.clientTop + scrollParent.scrollTop);
        });

        const virtualizer = createVirtualizer({
            get count() {
                return getCount();
            },
            get enabled() {
                return opts.getIsEnabled() && getScrollParent() !== undefined;
            },
            get estimateSize() {
                return opts.computeEstimatedSize;
            },
            get scrollMargin() {
                return getScrollMargin();
            },
            get rangeExtractor() {
                const pinned = opts.getPinnedRows?.() ?? [];

                return (range: Parameters<typeof defaultRangeExtractor>[0]) =>
                    [...new Set([...pinned, ...defaultRangeExtractor(range)])].sort((a, b) => a - b);
            },
            getScrollElement: () => getScrollParent() ?? null,
            measureElement: (element, entry, instance) => {
                const box = entry?.borderBoxSize?.[0];

                if (!box) return measureElement(element, entry, instance);

                return instance.options.horizontal ? box.inlineSize : box.blockSize;
            },
            overscan: opts.getOverscan?.(),
        });

        const getRows = createMemo(() => (opts.getIsEnabled() ? virtualizer.getVirtualItems() : []));

        const getTotalSize = createMemo(() => (opts.getIsEnabled() ? virtualizer.getTotalSize() : 0));

        return {
            getIsLive: () => opts.getIsEnabled() && getScrollParent() !== undefined,
            getRows,
            getTotalSize,
            getRowStart: (row) => row.start - getScrollMargin(),
            measureRow: (element, index) => {
                element.dataset.index = String(index);

                onMount(() => virtualizer.measureElement(element));
            },
            scrollToRow: (index) => virtualizer.scrollToIndex(index, { align: "auto" }),
        };
    };
}
