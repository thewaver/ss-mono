import { untrack } from "svelte";
import { Virtualizer, defaultRangeExtractor, elementScroll, measureElement, observeElementOffset, observeElementRect, } from "@tanstack/virtual-core";
import { VirtualizerUtils } from "@thewaver/ss-components";
const NO_ROWS = [];
/**
 * Draws only the rows of a long list that are on screen.
 *
 * A thin layer over TanStack's framework-free `virtual-core`, adding what this library's lists need: finding the
 * scrolling ancestor rather than being told about it, so a list can be dropped into any scroller; correcting for the
 * list not starting at the top of that scroller; and keeping pinned rows drawn however far away they are. The search
 * for the scroller is framework-free, in {@link VirtualizerUtils}.
 */
export var VirtualizerSvelteUtils;
(function (VirtualizerSvelteUtils) {
    /**
     * Finds the nearest ancestor that actually scrolls vertically, kept current as the element changes.
     *
     * {@link VirtualizerUtils.findScrollParent} following a getter.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The element to search up from.
     * @param getIsDisabled Pass `true` to stop looking.
     * @returns The scroller, or `undefined` when there is none — which is the signal that virtualizing cannot work
     * here and every row should be drawn.
     */
    VirtualizerSvelteUtils.createScrollParent = (getRef, getIsDisabled) => {
        let scrollParent = $state.raw();
        $effect(() => {
            const ref = getRef();
            scrollParent = ref && !getIsDisabled() ? untrack(() => VirtualizerUtils.findScrollParent(ref)) : undefined;
        });
        return () => scrollParent;
    };
    /**
     * Works out which rows to draw, and how to place them.
     *
     * The list does not have to start at the top of its scroller — there may be a header, or other content above it —
     * so the distance between the two is measured and taken off every position. That measurement also allows for a
     * scroller drawn under a CSS transform, where the rectangle on screen and the element's own height disagree.
     *
     * Everything falls back safely: with no scrolling ancestor or with virtualizing switched off, `getIsLive` reports
     * `false` and the caller should draw the whole list.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The list's own element.
     * @param getCount How many rows there are.
     * @param opts.getIsDisabled Whether to skip virtualizing altogether.
     * @param opts.computeEstimatedSize A row's likely height, used before it has been measured. Being wrong only
     * costs a scrollbar that settles as rows are measured.
     * @param opts.getPinnedRows Rows to keep drawn wherever the scroll is — a selected row that must stay measurable,
     * a row being dragged.
     * @param opts.getOverscan How many extra rows to draw beyond the visible ones, to cover a fast scroll.
     * @returns `getIsLive` for whether virtualizing is in effect, `getRows` and `getTotalSize` for what to draw and
     * how tall to make the spacer, `getRowStart` for a row's position, `measureRow(index)`, an attachment for that
     * row's element so its real height is learned, and `scrollToRow`. Key the drawn rows by their `index`, so a row
     * that stays on screen keeps its element.
     */
    VirtualizerSvelteUtils.createRowWindow = (getRef, getCount, opts) => {
        const getScrollParent = VirtualizerSvelteUtils.createScrollParent(getRef, opts.getIsDisabled);
        let scrollMargin = $state(0);
        $effect(() => {
            const ref = getRef();
            const scrollParent = getScrollParent();
            if (!ref || !scrollParent) {
                scrollMargin = 0;
                return;
            }
            untrack(() => {
                const scrollParentRect = scrollParent.getBoundingClientRect();
                const scale = scrollParent.offsetHeight ? scrollParentRect.height / scrollParent.offsetHeight : 1;
                const inset = (ref.getBoundingClientRect().top - scrollParentRect.top) / (scale || 1);
                scrollMargin = inset - scrollParent.clientTop + scrollParent.scrollTop;
            });
        });
        const computeOptions = () => {
            const pinned = opts.getPinnedRows?.() ?? [];
            return {
                count: getCount(),
                enabled: !opts.getIsDisabled() && getScrollParent() !== undefined,
                estimateSize: opts.computeEstimatedSize,
                scrollMargin,
                overscan: opts.getOverscan?.(),
                rangeExtractor: (range) => [...new Set([...pinned, ...defaultRangeExtractor(range)])].sort((a, b) => a - b),
                getScrollElement: () => getScrollParent() ?? null,
                measureElement: (element, entry, instance) => {
                    const box = entry?.borderBoxSize?.[0];
                    if (!box)
                        return measureElement(element, entry, instance);
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
        const virtualizer = new Virtualizer(untrack(computeOptions));
        let rows = $state.raw(virtualizer.getVirtualItems());
        let virtualTotalSize = $state(virtualizer.getTotalSize());
        const publish = () => {
            rows = virtualizer.getVirtualItems();
            virtualTotalSize = virtualizer.getTotalSize();
        };
        $effect(() => untrack(() => {
            const cleanup = virtualizer._didMount();
            virtualizer._willUpdate();
            return cleanup;
        }));
        $effect.pre(() => {
            const options = computeOptions();
            untrack(() => {
                virtualizer.setOptions(options);
                virtualizer._willUpdate();
                publish();
            });
        });
        const visibleRows = $derived(opts.getIsDisabled() ? NO_ROWS : rows);
        const totalSize = $derived(opts.getIsDisabled() ? 0 : virtualTotalSize);
        return {
            getIsLive: () => !opts.getIsDisabled() && getScrollParent() !== undefined,
            getRows: () => visibleRows,
            getTotalSize: () => totalSize,
            getRowStart: (row) => row.start - scrollMargin,
            measureRow: (index) => (element) => {
                element.dataset.index = String(index);
                untrack(() => virtualizer.measureElement(element));
            },
            scrollToRow: (index) => virtualizer.scrollToIndex(index, { align: "auto" }),
        };
    };
})(VirtualizerSvelteUtils || (VirtualizerSvelteUtils = {}));
