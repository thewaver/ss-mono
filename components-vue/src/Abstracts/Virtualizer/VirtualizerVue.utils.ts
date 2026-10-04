import {
    type ComponentPublicInstance,
    type MaybeRefOrGetter,
    type Ref,
    computed,
    nextTick,
    onUpdated,
    shallowRef,
    toValue,
    watchEffect,
} from "vue";

import {
    type Range,
    Virtualizer,
    type VirtualizerOptions,
    defaultRangeExtractor,
    elementScroll,
    measureElement,
    observeElementOffset,
} from "@tanstack/virtual-core";
import { type VirtualizerRow, VirtualizerUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { toElement } from "../../Utils/refUtils";

/** No pinned rows. */
const NO_PINNED_ROWS: number[] = [];

/** No rows to draw, shared so a disabled window does not hand out a new list each time. */
const NO_ROWS: VirtualizerRow[] = [];

/**
 * The Vue side of `VirtualizerUtils`: drawing only the rows of a long list that are on screen, over TanStack's
 * framework-free `virtual-core`.
 *
 * Adds what this library's lists need: finding the scrolling ancestor rather than being told about it, so a list
 * can be dropped into any scroller; correcting for the list not starting at the top of that scroller; and keeping
 * pinned rows drawn however far away they are.
 */
export namespace VirtualizerVueUtils {
    /**
     * Finds the nearest ancestor that actually scrolls vertically, again whenever the element changes.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to search up from.
     * @param isDisabled Pass `true` to stop looking.
     * @returns A ref of the scroller, or `undefined` when there is none — the signal that virtualizing cannot work
     * here and every row should be drawn.
     */
    export const useScrollParent = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const scrollParent = shallowRef<HTMLElement>();

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
            scrollParent.value = element && !isOff ? VirtualizerUtils.findScrollParent(element) : undefined;
        });

        return scrollParent as Readonly<Ref<HTMLElement | undefined>>;
    };

    /**
     * Works out which rows to draw, and how to place them.
     *
     * The list does not have to start at the top of its scroller, so the distance between the two is measured and
     * taken off every position — through the scroller's own scale, so it holds under a CSS transform. With no
     * scrolling ancestor or with virtualizing switched off, `isLive` is `false` and the caller should draw the whole
     * list.
     *
     * The window takes up its scroller, and reads the scroller's height, only once a render has been written, as
     * React's row window does in a layout effect: read any earlier and the height is the one from before the spacer
     * was given its size, and a scroll to a row is aligned against a box a few pixels tall. `isLive` turns `true`
     * at that moment rather than when the scroller is found, so a scroll asked for as soon as it does lands.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The list's own element.
     * @param count How many rows there are.
     * @param opts.isDisabled Whether to skip virtualizing altogether.
     * @param opts.computeEstimatedSize A row's likely height, used before it has been measured.
     * @param opts.pinnedRows Rows to keep drawn wherever the scroll is.
     * @param opts.overscan How many extra rows to draw beyond the visible ones.
     * @returns Refs of `isLive`, `rows` and `totalSize` for what to draw and how tall to make the spacer;
     * `getRowStart` for a row's position, `measureRow(index)`, a function ref for that row's element so its real
     * height is learned, and `scrollToRow`.
     */
    export const useRowWindow = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        count: MaybeRefOrGetter<number>,
        opts: {
            isDisabled?: MaybeRefOrGetter<boolean | undefined>;
            computeEstimatedSize: (index: number) => number;
            pinnedRows?: MaybeRefOrGetter<number[] | undefined>;
            overscan?: MaybeRefOrGetter<number | undefined>;
        },
    ) => {
        const getIsDisabled = () => toValue(opts.isDisabled) ?? false;
        const scrollParent = useScrollParent(ref, getIsDisabled);
        const scrollMargin = shallowRef(0);
        const measured = new WeakMap<Element, number>();

        watchAfterRender([() => toValue(ref), scrollParent], ([element, scroller]) => {
            if (!element || !scroller) {
                scrollMargin.value = 0;

                return;
            }

            const scrollParentRect = scroller.getBoundingClientRect();
            const scale = scroller.offsetHeight ? scrollParentRect.height / scroller.offsetHeight : 1;
            const inset = (element.getBoundingClientRect().top - scrollParentRect.top) / (scale || 1);

            scrollMargin.value = inset - scroller.clientTop + scroller.scrollTop;
        });

        const computeOptions = (): VirtualizerOptions<HTMLElement, HTMLElement> => {
            const pinnedRows = toValue(opts.pinnedRows) ?? NO_PINNED_ROWS;

            return {
                count: toValue(count),
                enabled: !getIsDisabled() && scrollParent.value !== undefined,
                estimateSize: opts.computeEstimatedSize,
                scrollMargin: scrollMargin.value,
                overscan: toValue(opts.overscan),
                rangeExtractor: (range: Range) =>
                    [...new Set([...pinnedRows, ...defaultRangeExtractor(range)])].sort((a, b) => a - b),
                getScrollElement: () => scrollParent.value ?? null,
                measureElement: (row, entry, instance) => {
                    const box = entry?.borderBoxSize?.[0];

                    if (!box) return measureElement(row, entry, instance);

                    return instance.options.horizontal ? box.inlineSize : box.blockSize;
                },
                observeElementRect: VirtualizerUtils.observeClientRect,
                observeElementOffset,
                scrollToFn: elementScroll,
                onChange: () => publish(),
            };
        };

        const virtualizer = new Virtualizer(computeOptions());
        const rows = shallowRef<VirtualizerRow[]>(virtualizer.getVirtualItems());
        const totalSize = shallowRef(virtualizer.getTotalSize());

        const publish = () => {
            rows.value = virtualizer.getVirtualItems();
            totalSize.value = virtualizer.getTotalSize();
        };

        const isFollowing = shallowRef(false);

        const followScroller = () => {
            virtualizer._willUpdate();
            isFollowing.value = virtualizer.scrollElement !== null;
        };

        watchEffect(() => {
            virtualizer.setOptions(computeOptions());
            publish();
        });

        watchAfterRender([], () => {
            const cleanup = virtualizer._didMount();

            followScroller();

            return cleanup;
        });

        onUpdated(followScroller);

        return {
            isLive: computed(() => !getIsDisabled() && isFollowing.value),
            rows: computed(() => (getIsDisabled() ? NO_ROWS : rows.value)),
            totalSize: computed(() => (getIsDisabled() ? 0 : totalSize.value)),
            getRowStart: (row: VirtualizerRow) => row.start - scrollMargin.value,
            measureRow: (index: number) => (target: Element | ComponentPublicInstance | null) => {
                const row = toElement(target);

                if (!row || measured.get(row) === index) return;

                measured.set(row, index);
                row.dataset.index = String(index);

                if (row.isConnected) {
                    virtualizer.measureElement(row);

                    return;
                }

                void nextTick(() => {
                    if (row.isConnected) virtualizer.measureElement(row);
                });
            },
            scrollToRow: (index: number) => virtualizer.scrollToIndex(index, { align: "auto" }),
        };
    };
}
