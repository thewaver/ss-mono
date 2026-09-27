import { type RefObject, useLayoutEffect, useReducer, useRef, useState } from "react";
import { flushSync } from "react-dom";

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
import { type VirtualizerRow, VirtualizerUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";

/** No pinned rows. */
const NO_PINNED_ROWS: number[] = [];

/**
 * The React side of `VirtualizerUtils`: drawing only the rows of a long list that are on screen, over TanStack's
 * framework-free `virtual-core`.
 *
 * Adds what this library's lists need: finding the scrolling ancestor rather than being told about it, so a list
 * can be dropped into any scroller; correcting for the list not starting at the top of that scroller; and keeping
 * pinned rows drawn however far away they are.
 */
export namespace VirtualizerReactUtils {
    /**
     * Finds the nearest ancestor that actually scrolls vertically, again whenever the element changes.
     *
     * @param ref The element to search up from.
     * @param isDisabled Pass `true` to stop looking.
     * @returns The scroller, or `undefined` when there is none — the signal that virtualizing cannot work here and
     * every row should be drawn.
     */
    export const useScrollParent = (ref: RefObject<HTMLElement | null>, isDisabled = false) => {
        const element = useElement(ref);
        const [scrollParent, setScrollParent] = useState<HTMLElement>();

        useLayoutEffect(() => {
            setScrollParent(element && !isDisabled ? VirtualizerUtils.findScrollParent(element) : undefined);
        }, [element, isDisabled]);

        return scrollParent;
    };

    /**
     * Works out which rows to draw, and how to place them.
     *
     * The list does not have to start at the top of its scroller, so the distance between the two is measured and
     * taken off every position — through the scroller's own scale, so it holds under a CSS transform. With no
     * scrolling ancestor or with virtualizing switched off, `isLive` is `false` and the caller should draw the whole
     * list.
     *
     * @param ref The list's own element.
     * @param count How many rows there are.
     * @param opts.isDisabled Whether to skip virtualizing altogether.
     * @param opts.computeEstimatedSize A row's likely height, used before it has been measured.
     * @param opts.pinnedRows Rows to keep drawn wherever the scroll is.
     * @param opts.overscan How many extra rows to draw beyond the visible ones.
     * @returns `isLive`, `rows` and `totalSize` for what to draw and how tall to make the spacer, `getRowStart` for a
     * row's position, `measureRow(index)`, a ref callback for that row's element so its real height is learned, and
     * `scrollToRow`.
     */
    export const useRowWindow = (
        ref: RefObject<HTMLElement | null>,
        count: number,
        opts: {
            isDisabled?: boolean;
            computeEstimatedSize: (index: number) => number;
            pinnedRows?: number[];
            overscan?: number;
        },
    ) => {
        const isDisabled = opts.isDisabled ?? false;
        const element = useElement(ref);
        const scrollParent = useScrollParent(ref, isDisabled);
        const [scrollMargin, setScrollMargin] = useState(0);
        const [, rerender] = useReducer((tick: number) => tick + 1, 0);

        useLayoutEffect(() => {
            if (!element || !scrollParent) {
                setScrollMargin(0);

                return;
            }

            const scrollParentRect = scrollParent.getBoundingClientRect();
            const scale = scrollParent.offsetHeight ? scrollParentRect.height / scrollParent.offsetHeight : 1;
            const inset = (element.getBoundingClientRect().top - scrollParentRect.top) / (scale || 1);

            setScrollMargin(inset - scrollParent.clientTop + scrollParent.scrollTop);
        }, [element, scrollParent]);

        const isInsideReactRef = useRef(false);

        const whileInsideReact = <T>(run: () => T) => {
            isInsideReactRef.current = true;

            try {
                return run();
            } finally {
                isInsideReactRef.current = false;
            }
        };

        const pinnedRows = opts.pinnedRows ?? NO_PINNED_ROWS;

        const options: VirtualizerOptions<HTMLElement, HTMLElement> = {
            count,
            enabled: !isDisabled && scrollParent !== undefined,
            estimateSize: opts.computeEstimatedSize,
            scrollMargin,
            overscan: opts.overscan,
            rangeExtractor: (range: Range) =>
                [...new Set([...pinnedRows, ...defaultRangeExtractor(range)])].sort((a, b) => a - b),
            getScrollElement: () => scrollParent ?? null,
            measureElement: (row, entry, instance) => {
                const box = entry?.borderBoxSize?.[0];

                if (!box) return measureElement(row, entry, instance);

                return instance.options.horizontal ? box.inlineSize : box.blockSize;
            },
            observeElementRect,
            observeElementOffset,
            scrollToFn: elementScroll,
            onChange: (_instance, isSync) => (isSync && !isInsideReactRef.current ? flushSync(rerender) : rerender()),
        };

        const [virtualizer] = useState(() => new Virtualizer(options));

        virtualizer.setOptions(options);

        useLayoutEffect(() => whileInsideReact(() => virtualizer._didMount()), [virtualizer]);

        useLayoutEffect(() => {
            whileInsideReact(() => virtualizer._willUpdate());
        });

        const rows: VirtualizerRow[] = isDisabled ? [] : virtualizer.getVirtualItems();

        return {
            isLive: !isDisabled && scrollParent !== undefined,
            rows,
            totalSize: isDisabled ? 0 : virtualizer.getTotalSize(),
            getRowStart: (row: VirtualizerRow) => row.start - scrollMargin,
            measureRow: (index: number) => (row: HTMLElement | null) => {
                if (!row) return;

                row.dataset.index = String(index);
                whileInsideReact(() => virtualizer.measureElement(row));
            },
            scrollToRow: (index: number) => virtualizer.scrollToIndex(index, { align: "auto" }),
        };
    };
}
