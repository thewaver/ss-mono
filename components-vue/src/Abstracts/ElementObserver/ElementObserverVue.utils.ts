import { type MaybeRefOrGetter, type Ref, computed, shallowRef, toValue } from "vue";

import { ElementObserverUtils } from "@thewaver/ss-components";
import { type Bounds, type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStableList } from "../../Utils/refUtils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** Nothing measured yet. */
const NO_SIZE: Size2d = { width: 0, height: 0 };

/** Shared empty result, so a disabled observer does not hand out a new array each time. */
const EMPTY_SIZES: Size2d[] = [];

/** Shared empty result, so an observer with nothing measured does not hand out a new array each time. */
const EMPTY_RECTS: (Rect | undefined)[] = [];

/** Whether two size lists match entry for entry. */
const isSameSizeList = (a: Size2d[], b: Size2d[]) =>
    a.length === b.length && a.every((size, index) => Size2d.isSame(size, b[index]));

/** Whether two rect lists match entry for entry, an entry missing on both sides counting as a match. */
const isSameRectList = (a: (Rect | undefined)[], b: (Rect | undefined)[]) =>
    a.length === b.length &&
    a.every((rect, index) => (rect === undefined ? b[index] === undefined : Rect.isSame(rect, b[index])));

/** Whether two optional rects match, two missing ones counting as a match. */
const isSameRect = (a: Rect | undefined, b: Rect | undefined) =>
    a === undefined ? b === undefined : b !== undefined && Rect.isSame(a, b);

/** A ref whose setter keeps the old value when the new one is the same by `isSame`, so nothing re-renders. */
const useDedupedRef = <T>(initial: T, isSame: (a: T, b: T) => boolean) => {
    const value = shallowRef(initial);

    const set = (next: T) => {
        if (!isSame(value.value, next)) value.value = next;
    };

    return [value as Readonly<Ref<T>>, set] as const;
};

/**
 * The Vue side of `ElementObserverUtils`: each observer following an element or a list of elements, its reading
 * kept in a ref, and torn down on unmount. A reading that has not changed leaves the ref alone, so nothing re-renders
 * for it. Every measurement in viewport coordinates reads the nearest provided viewport, or the window without one.
 *
 * Every composable here must run inside a component's `setup`.
 */
export namespace ElementObserverVueUtils {
    /**
     * Watches an element's size, borders and padding included.
     *
     * @param ref The element to watch. Nothing is measured until it exists.
     * @param isDisabled Pass `true` to stop watching.
     * @returns A ref of the current size, starting from a measurement taken as the element mounts. Zeroes before it
     * exists.
     */
    export const useBorderBoxSize = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const [size, setSize] = useDedupedRef(NO_SIZE, Size2d.isSame);

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) =>
            element && !isOff ? ElementObserverUtils.observeBorderBoxSize(element, setSize) : undefined,
        );

        return size;
    };

    /**
     * Watches several elements' sizes at once, re-measuring the whole list whenever any of them changes.
     *
     * @param elements The elements to watch, in the order the sizes should come back. Missing entries are kept as
     * zeroes rather than dropped. A list with the same entries as the last one counts as unchanged.
     * @param isDisabled Pass `true` to stop watching.
     * @returns A ref of one size per element, and an empty list while disabled.
     */
    export const useBorderBoxSizes = (
        elements: MaybeRefOrGetter<Array<HTMLElement | undefined>>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const stableElements = useStableList(() => toValue(elements));
        const [sizes, setSizes] = useDedupedRef(EMPTY_SIZES, isSameSizeList);

        watchAfterRender([stableElements, () => toValue(isDisabled)], ([list, isOff]) => {
            if (isOff) {
                setSizes(EMPTY_SIZES);

                return;
            }

            return ElementObserverUtils.observeBorderBoxSizes(list, setSizes);
        });

        return sizes;
    };

    /**
     * Watches just an element's height.
     *
     * @param ref The element to watch.
     * @param isDisabled Pass `true` to stop watching.
     * @returns A computed ref of the current height.
     */
    export const useBorderBoxHeight = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const size = useBorderBoxSize(ref, isDisabled);

        return computed(() => size.value.height);
    };

    /**
     * Watches whether an element is on screen.
     *
     * @param ref The element to watch.
     * @param isDisabled Pass `true` to stop watching.
     * @returns A ref of whether any part of the element is visible. `false` before the element exists, while
     * disabled, and until the observer first reports.
     */
    export const useViewportIntersection = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const isIntersecting = shallowRef(false);

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
            isIntersecting.value = false;

            if (!element || isOff) return;

            return ElementObserverUtils.observeViewportIntersection(element, (value) => {
                isIntersecting.value = value;
            });
        });

        return isIntersecting as Readonly<Ref<boolean>>;
    };

    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * One measurement is taken as the element mounts whatever `isVisible` says, and the frame loop and listeners of
     * `ElementObserverUtils.observeViewportRect` run while it says `true`.
     *
     * @param ref The element to measure.
     * @param isVisible Whether to keep measuring.
     * @param opts.padding Grows the rectangle outwards, either evenly or edge by edge. Read at each measurement.
     * @param opts.offset Shifts the rectangle. Applied after the padding. Read at each measurement.
     * @returns A ref of the rectangle, or `undefined` before the element has been measured.
     */
    export const useViewportRect = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isVisible: MaybeRefOrGetter<boolean>,
        opts?: {
            padding?: MaybeRefOrGetter<Bounds | number | undefined>;
            offset?: MaybeRefOrGetter<Point2d | undefined>;
        },
    ) => {
        const viewportContext = useViewportContext();
        const [rect, setRect] = useDedupedRef<Rect | undefined>(undefined, isSameRect);

        const getPadding = () => toValue(opts?.padding) ?? 0;
        const getOffset = () => toValue(opts?.offset) ?? { x: 0, y: 0 };

        watchAfterRender([() => toValue(ref)], ([element]) => {
            if (!element) return;

            setRect(
                ElementObserverUtils.measureViewportRect(element, viewportContext, {
                    padding: getPadding(),
                    offset: getOffset(),
                }),
            );
        });

        watchAfterRender([() => toValue(ref), () => toValue(isVisible)], ([element, isShown]) => {
            if (!element || !isShown) return;

            return ElementObserverUtils.observeViewportRect(() => element, viewportContext, setRect, {
                getPadding,
                getOffset,
            });
        });

        return rect;
    };

    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * @param elements The elements to measure, in the order the rects should come back. A missing entry is kept as
     * `undefined`. A list with the same entries as the last one counts as unchanged.
     * @param isVisible Whether to keep measuring.
     * @returns A ref of one rect per element, measured once as the list arrives and every frame while visible.
     */
    export const useViewportRects = (
        elements: MaybeRefOrGetter<Array<HTMLElement | undefined>>,
        isVisible: MaybeRefOrGetter<boolean>,
    ) => {
        const viewportContext = useViewportContext();
        const stableElements = useStableList(() => toValue(elements));
        const [rects, setRects] = useDedupedRef(EMPTY_RECTS, isSameRectList);

        watchAfterRender([stableElements], ([list]) => {
            setRects(ElementObserverUtils.measureViewportRects(list, viewportContext));
        });

        watchAfterRender([stableElements, () => toValue(isVisible)], ([list, isShown]) => {
            if (!isShown) return;

            return ElementObserverUtils.observeViewportRects(() => list, viewportContext, setRects);
        });

        return rects;
    };

    /**
     * Follows which of a list of elements the reader has scrolled to, in viewport coordinates.
     *
     * @param elements The elements to follow, in reading order. A missing entry is never current.
     * @param isDisabled Pass `true` to stop following.
     * @param opts.offsetRatio Where the line sits, as a share of the viewport's height from its top.
     * @returns A ref of the current element's index, or `undefined` while none has passed the line and while
     * disabled.
     */
    export const useCurrentIndex = (
        elements: MaybeRefOrGetter<Array<HTMLElement | undefined>>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
        opts?: { offsetRatio?: MaybeRefOrGetter<number | undefined> },
    ) => {
        const viewportContext = useViewportContext();
        const stableElements = useStableList(() => toValue(elements));
        const index = shallowRef<number>();

        watchAfterRender(
            [stableElements, () => toValue(isDisabled), () => toValue(opts?.offsetRatio)],
            ([list, isOff, offsetRatio]) => {
                if (isOff) {
                    index.value = undefined;

                    return;
                }

                return ElementObserverUtils.observeCurrentIndex(
                    list,
                    viewportContext,
                    (next) => {
                        index.value = next;
                    },
                    { offsetRatio },
                );
            },
        );

        return index as Readonly<Ref<number | undefined>>;
    };

    /**
     * Follows how far an element has traveled through the viewport as the page scrolls.
     *
     * @param ref The element to follow.
     * @param isDisabled Pass `true` to stop following.
     * @returns A ref that is `0` while the element has yet to come up from below the viewport, `1` once it has left
     * through the top, and the share in between. `0` before the element exists and while disabled.
     */
    export const useViewportProgress = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const viewportContext = useViewportContext();
        const progress = shallowRef(0);

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
            if (!element || isOff) {
                progress.value = 0;

                return;
            }

            return ElementObserverUtils.observeViewportProgress(element, viewportContext, (next) => {
                progress.value = next;
            });
        });

        return progress as Readonly<Ref<number>>;
    };

    /**
     * Follows how far an element has traveled through a scrolling box as the box scrolls.
     *
     * @param ref The element to follow.
     * @param containerRef The scrolling box it travels through.
     * @param isDisabled Pass `true` to stop following.
     * @returns A ref of the share of the passage across the box's visible area covered, as
     * `ElementObserverUtils.observeScrollContainerProgress` gives it. `0` before either element exists and while
     * disabled.
     */
    export const useScrollContainerProgress = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        containerRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean> = false,
    ) => {
        const viewportContext = useViewportContext();
        const progress = shallowRef(0);

        watchAfterRender(
            [() => toValue(ref), () => toValue(containerRef), () => toValue(isDisabled)],
            ([element, container, isOff]) => {
                if (!element || !container || isOff) {
                    progress.value = 0;

                    return;
                }

                return ElementObserverUtils.observeScrollContainerProgress(
                    element,
                    () => container,
                    viewportContext,
                    (next) => {
                        progress.value = next;
                    },
                );
            },
        );

        return progress as Readonly<Ref<number>>;
    };
}
