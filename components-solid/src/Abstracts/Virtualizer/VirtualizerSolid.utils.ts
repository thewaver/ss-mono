import type { Accessor } from "solid-js";
import { createComputed, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import {
    type Range,
    Virtualizer,
    type VirtualizerOptions,
    defaultRangeExtractor,
    elementScroll,
    measureElement,
    observeElementOffset,
    observeElementRect,
} from "@tanstack/virtual-core";
import { VirtualizerUtils } from "@thewaver/ss-components";

import type { VirtualizerRowWindow, VirtualizerRowWindowOpts } from "./VirtualizerSolid.types";

/**
 * Draws only the rows of a long list that are on screen.
 *
 * A thin layer over TanStack's framework-free `virtual-core`, adding what this library's lists need: finding the
 * scrolling ancestor rather than being told about it, so a list can be dropped into any scroller;
 * correcting for the list not starting at the top of that scroller; and keeping pinned rows drawn
 * however far away they are. The search for the scroller is framework-free, in {@link VirtualizerUtils}.
 */
export namespace VirtualizerSolidUtils {
    /**
     * Finds the nearest ancestor that actually scrolls vertically, kept current as the element changes.
     *
     * {@link VirtualizerUtils.findScrollParent} following an accessor.
     *
     * @param getRef The element to search up from.
     * @param getIsDisabled Pass `true` to stop looking.
     * @returns The scroller, or `undefined` when there is none — which is the signal that virtualizing
     * cannot work here and every row should be drawn.
     */
    export const createScrollParent = (getRef: Accessor<HTMLElement | undefined>, getIsDisabled: Accessor<boolean>) => {
        const [getScrollParent, setScrollParent] = createSignal<HTMLElement>();

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled()) {
                setScrollParent(undefined);

                return;
            }

            setScrollParent(VirtualizerUtils.findScrollParent(ref));
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
     * Everything falls back safely: with no scrolling ancestor or with virtualizing switched off,
     * `getIsLive` reports `false` and the caller should draw the whole list.
     *
     * @param getRef The list's own element.
     * @param getCount How many rows there are.
     * @param opts.getIsDisabled Whether to skip virtualizing altogether.
     * @param opts.computeEstimatedSize A row's likely height, used before it has been measured. Being
     * wrong only costs a scrollbar that settles as rows are measured.
     * @param opts.getPinnedRows Rows to keep drawn wherever the scroll is — a selected row that must
     * stay measurable, a row being dragged.
     * @param opts.getOverscan How many extra rows to draw beyond the visible ones, to cover a fast
     * scroll.
     * @returns `getIsLive` for whether virtualizing is in effect, `getRows` and `getTotalSize` for what
     * to draw and how tall to make the spacer, `getRowStart` for a row's position, `measureRow` to
     * attach to each row's element so its real height is learned, and `scrollToRow`.
     */
    export const createRowWindow = (
        getRef: Accessor<HTMLElement | undefined>,
        getCount: Accessor<number>,
        opts: VirtualizerRowWindowOpts,
    ): VirtualizerRowWindow => {
        const getScrollParent = createScrollParent(getRef, opts.getIsDisabled);

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

        const computeOptions = (): VirtualizerOptions<HTMLElement, HTMLElement> => {
            const pinned = opts.getPinnedRows?.() ?? [];

            return {
                count: getCount(),
                enabled: !opts.getIsDisabled() && getScrollParent() !== undefined,
                estimateSize: opts.computeEstimatedSize,
                scrollMargin: getScrollMargin(),
                overscan: opts.getOverscan?.(),
                rangeExtractor: (range: Range) =>
                    [...new Set([...pinned, ...defaultRangeExtractor(range)])].sort((a, b) => a - b),
                getScrollElement: () => getScrollParent() ?? null,
                measureElement: (element, entry, instance) => {
                    const box = entry?.borderBoxSize?.[0];

                    if (!box) return measureElement(element, entry, instance);

                    return instance.options.horizontal ? box.inlineSize : box.blockSize;
                },
                observeElementRect,
                observeElementOffset,
                scrollToFn: elementScroll,
                onChange: (instance) => {
                    instance._willUpdate();
                    publish();
                },
            };
        };

        const virtualizer = new Virtualizer(computeOptions());
        const [items, setItems] = createStore(virtualizer.getVirtualItems());
        const [getVirtualTotalSize, setVirtualTotalSize] = createSignal(virtualizer.getTotalSize());

        const publish = () => {
            setItems(reconcile(virtualizer.getVirtualItems(), { key: "index" }));
            setVirtualTotalSize(virtualizer.getTotalSize());
        };

        onMount(() => {
            const cleanup = virtualizer._didMount();

            virtualizer._willUpdate();
            onCleanup(cleanup);
        });

        createComputed(() => {
            virtualizer.setOptions(computeOptions());
            virtualizer._willUpdate();
            publish();
        });

        const getRows = createMemo(() => (opts.getIsDisabled() ? [] : items));

        const getTotalSize = createMemo(() => (opts.getIsDisabled() ? 0 : getVirtualTotalSize()));

        return {
            getIsLive: () => !opts.getIsDisabled() && getScrollParent() !== undefined,
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
