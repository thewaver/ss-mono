import type { Accessor, Setter } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { CURRENT_INDEX_OBSERVER_DEFAULTS, ElementObserverUtils } from "@thewaver/ss-components";
import { type Bounds, type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { useViewportContext } from "../Viewport/Viewport.context";

/** Shared empty result, so a disabled observer does not hand out a new array each time. */
const EMPTY_SIZES: Size2d[] = [];

/** Shared empty result, so a disabled observer does not hand out a new array each time. */
const EMPTY_RECTS: (Rect | undefined)[] = [];

/** Whether two size lists match entry for entry. */
const isSameSizeList = (a: Size2d[], b: Size2d[]) =>
    a.length === b.length && a.every((size, index) => Size2d.isSame(size, b[index]));

/** Whether two rect lists match entry for entry, an entry missing on both sides counting as a match. */
const isSameRectList = (a: (Rect | undefined)[], b: (Rect | undefined)[]) =>
    a.length === b.length &&
    a.every((rect, index) => (rect === undefined ? b[index] === undefined : Rect.isSame(rect, b[index])));

/**
 * The Solid side of {@link ElementObserverUtils}: each observer as an accessor in and an accessor out, torn down on
 * cleanup.
 *
 * Each takes an optional disabled accessor so a component that is off screen or collapsed can stop measuring,
 * and each de-duplicates its results, so a resize that does not change the numbers does not wake anything
 * downstream. All of them must run inside a component or another reactive owner.
 */
export namespace ElementObserverSolidUtils {
    /**
     * Watches an element's size, borders and padding included.
     *
     * {@link ElementObserverUtils.observeBorderBoxSize} following an accessor.
     *
     * @param getRef The element to watch. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns The current size, starting from an immediate measurement rather than waiting for the
     * first observer callback. Zeroes before the element exists.
     */
    export const createBorderBoxSizeObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const [getSize, setSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) return;

            onCleanup(ElementObserverUtils.observeBorderBoxSize(ref, setSize));
        });

        return getSize;
    };

    /**
     * Watches several elements' sizes at once.
     *
     * {@link ElementObserverUtils.observeBorderBoxSizes} following an accessor.
     *
     * @param getRefs The elements to watch, in the order the sizes should come back. Missing entries
     * are kept as zeroes rather than dropped, so the result always lines up with the input.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns One size per element, and an empty list while disabled.
     */
    export const createBorderBoxSizeListObserver = (
        getRefs: Accessor<Array<HTMLElement | undefined>>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const [getSizes, setSizes] = createSignal<Size2d[]>(EMPTY_SIZES, { equals: isSameSizeList });

        createEffect(() => {
            const refs = getRefs();

            if (getIsDisabled?.()) {
                setSizes(EMPTY_SIZES);

                return;
            }

            onCleanup(ElementObserverUtils.observeBorderBoxSizes(refs, setSizes));
        });

        return getSizes;
    };

    /**
     * Watches just an element's height.
     *
     * @param getRef The element to watch.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns The current height. Changes only when the height does, so a width-only resize wakes
     * nothing.
     */
    export const createBorderBoxHeightObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const getSize = createBorderBoxSizeObserver(getRef, getIsDisabled);

        return createMemo(() => getSize().height);
    };

    /**
     * Watches whether an element is on screen.
     *
     * {@link ElementObserverUtils.observeViewportIntersection} following an accessor.
     *
     * @param getRef The element to watch.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns Whether any part of the element is currently visible. `false` before the element exists,
     * while disabled, and until the observer first reports.
     */
    export const createViewportIntersectionObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const [getIsIntersecting, setIsIntersecting] = createSignal(false);

        createEffect(() => {
            const ref = getRef();

            setIsIntersecting(false);

            if (!ref || getIsDisabled?.()) return;

            onCleanup(ElementObserverUtils.observeViewportIntersection(ref, setIsIntersecting));
        });

        return getIsIntersecting;
    };

    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportRect} for as long as `getIsVisible` says so, with one measurement
     * taken on mount whatever it says. The rectangle comes back in the enclosing viewport's coordinates rather
     * than the screen's, so it is correct inside a zoomed or panned `Viewport`.
     *
     * @param getRef The element to measure.
     * @param getIsVisible Whether to keep measuring. The frame loop and the listeners both follow this.
     * @param opts.setElementRect Where to write the result.
     * @param opts.getPadding Grows the rectangle outwards, either evenly or edge by edge. Useful for a
     * hover target that should extend past what is drawn.
     * @param opts.getOffset Shifts the rectangle. Applied after the padding.
     */
    export const createViewportRectObserver = <T extends HTMLElement>(
        getRef: Accessor<T | undefined>,
        getIsVisible: Accessor<boolean>,
        opts: {
            setElementRect: Setter<Rect | undefined>;
            getPadding?: () => Bounds | number;
            getOffset?: () => Point2d;
        },
    ) => {
        const viewportContext = useViewportContext();

        const report = (rect: Rect) => {
            opts.setElementRect(rect);
        };

        onMount(() => {
            const ref = getRef();

            if (!ref) return;

            report(
                ElementObserverUtils.measureViewportRect(ref, viewportContext, {
                    padding: opts.getPadding?.(),
                    offset: opts.getOffset?.(),
                }),
            );
        });

        createEffect(() => {
            if (!getIsVisible()) return;

            onCleanup(ElementObserverUtils.observeViewportRect(getRef, viewportContext, report, opts));
        });
    };

    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportRects} for as long as `getIsVisible` says so, with one measurement
     * taken on mount whatever it says.
     *
     * @param getRefs The elements to measure, in the order the rects should come back. A missing entry
     * is kept as `undefined` rather than dropped, so the result always lines up with the input.
     * @param getIsVisible Whether to keep measuring. The frame loop and the listeners both follow this.
     * @returns One rect per element, in the enclosing viewport's coordinates. `undefined` for an entry
     * that has no element.
     */
    export const createViewportRectListObserver = (
        getRefs: Accessor<Array<HTMLElement | undefined>>,
        getIsVisible: Accessor<boolean>,
    ) => {
        const viewportContext = useViewportContext();
        const [getRects, setRects] = createSignal<(Rect | undefined)[]>(EMPTY_RECTS, { equals: isSameRectList });

        onMount(() => {
            setRects(ElementObserverUtils.measureViewportRects(getRefs(), viewportContext));
        });

        createEffect(() => {
            if (!getIsVisible()) return;

            onCleanup(ElementObserverUtils.observeViewportRects(getRefs, viewportContext, setRects));
        });

        return getRects;
    };

    /**
     * Follows which of a list of elements the reader has scrolled to, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeCurrentIndex} following accessors.
     *
     * @param getRefs The elements to follow, in reading order. A missing entry is kept in place and never current.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @param opts.getOffsetRatio Where the line sits, as a share of the viewport's height from its top. Defaults to
     * `CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio`.
     * @returns The current element's index, or `undefined` while none has passed the line and while disabled.
     */
    export const createViewportCurrentIndexObserver = (
        getRefs: Accessor<Array<HTMLElement | undefined>>,
        getIsDisabled?: Accessor<boolean>,
        opts?: { getOffsetRatio?: Accessor<number> },
    ) => {
        const viewportContext = useViewportContext();
        const [getIndex, setIndex] = createSignal<number | undefined>();

        createEffect(() => {
            const refs = getRefs();
            const offsetRatio = opts?.getOffsetRatio?.() ?? CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio;

            if (getIsDisabled?.()) {
                setIndex(undefined);

                return;
            }

            onCleanup(
                ElementObserverUtils.observeCurrentIndex(refs, viewportContext, (index) => setIndex(index), {
                    offsetRatio,
                }),
            );
        });

        return getIndex;
    };

    /**
     * Follows how far an element has traveled through the viewport as the page scrolls, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportProgress} following accessors. It is the getter half of a
     * progress signal — a trail, an animation or anything else that takes `0`–`1` can be driven by the page's
     * scroll position with it, with its own playback off.
     *
     * @param getRef The element to follow. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @returns `0` while the element has yet to come up from below the viewport, `1` once it has left through the
     * top, and the share in between while it crosses. `0` before the element exists and while disabled.
     */
    export const createViewportProgressObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const viewportContext = useViewportContext();
        const [getProgress, setProgress] = createSignal(0);

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) {
                setProgress(0);

                return;
            }

            onCleanup(ElementObserverUtils.observeViewportProgress(ref, viewportContext, setProgress));
        });

        return getProgress;
    };

    /**
     * Follows how far an element has traveled through a scrolling box as the box scrolls, in the box's coordinates.
     *
     * {@link ElementObserverUtils.observeScrollContainerProgress} following accessors. It is what drives something
     * from the scroll of a panel, a list or a pane rather than of the page.
     *
     * @param getRef The element to follow. Nothing is measured until it exists.
     * @param getContainerRef The scrolling box it travels through. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @returns `0` while the element has yet to come up from below the box's visible area, `1` once it has left
     * through the top, and the share in between while it crosses. `0` before either element exists and while
     * disabled.
     */
    export const createScrollContainerProgressObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getContainerRef: Accessor<HTMLElement | undefined>,
        getIsDisabled?: Accessor<boolean>,
    ) => {
        const viewportContext = useViewportContext();
        const [getProgress, setProgress] = createSignal(0);

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled?.()) {
                setProgress(0);

                return;
            }

            onCleanup(
                ElementObserverUtils.observeScrollContainerProgress(ref, getContainerRef, viewportContext, setProgress),
            );
        });

        return getProgress;
    };
}
