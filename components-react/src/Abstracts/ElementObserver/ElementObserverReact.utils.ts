import { type RefObject, useLayoutEffect, useState } from "react";

import { ElementObserverUtils } from "@thewaver/ss-components";
import { type Bounds, type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { useElement, useLatest, useStableList } from "../../Utils/refUtils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** Nothing measured yet. */
const NO_SIZE: Size2d = { width: 0, height: 0 };

/** Shared empty result, so a disabled observer does not hand out a new array each render. */
const EMPTY_SIZES: Size2d[] = [];

/** Shared empty result, so an observer with nothing measured does not hand out a new array each render. */
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

/** A state whose setter keeps the old value when the new one is the same by `isSame`, so nothing re-renders. */
const useDedupedState = <T>(initial: T, isSame: (a: T, b: T) => boolean) => {
    const [value, setValue] = useState(initial);

    return [value, (next: T) => setValue((previous) => (isSame(previous, next) ? previous : next))] as const;
};

/**
 * The React side of `ElementObserverUtils`: each observer following a ref or a list of elements, its reading kept in
 * state, and torn down on unmount. A reading that has not changed leaves the state alone, so nothing re-renders for
 * it. Every measurement in viewport coordinates reads the nearest `ViewportContextProvider`, or the window without
 * one.
 */
export namespace ElementObserverReactUtils {
    /**
     * Watches an element's size, borders and padding included.
     *
     * @param ref The element to watch. Nothing is measured until it exists.
     * @param isDisabled Pass `true` to stop watching.
     * @returns The current size, starting from a measurement taken as the element mounts. Zeroes before it exists.
     */
    export const useBorderBoxSize = (ref: RefObject<HTMLElement | null>, isDisabled = false) => {
        const element = useElement(ref);
        const [size, setSize] = useDedupedState(NO_SIZE, Size2d.isSame);

        useLayoutEffect(
            () => (element && !isDisabled ? ElementObserverUtils.observeBorderBoxSize(element, setSize) : undefined),
            [element, isDisabled],
        );

        return size;
    };

    /**
     * Watches several elements' sizes at once, re-measuring the whole list whenever any of them changes.
     *
     * @param elements The elements to watch, in the order the sizes should come back. Missing entries are kept as
     * zeroes rather than dropped. A list with the same entries as last render counts as unchanged.
     * @param isDisabled Pass `true` to stop watching.
     * @returns One size per element, and an empty list while disabled.
     */
    export const useBorderBoxSizes = (elements: Array<HTMLElement | undefined>, isDisabled = false) => {
        const stableElements = useStableList(elements);
        const [sizes, setSizes] = useDedupedState(EMPTY_SIZES, isSameSizeList);

        useLayoutEffect(() => {
            if (isDisabled) {
                setSizes(EMPTY_SIZES);

                return;
            }

            return ElementObserverUtils.observeBorderBoxSizes(stableElements, setSizes);
        }, [stableElements, isDisabled]);

        return sizes;
    };

    /**
     * Watches just an element's height.
     *
     * @param ref The element to watch.
     * @param isDisabled Pass `true` to stop watching.
     * @returns The current height.
     */
    export const useBorderBoxHeight = (ref: RefObject<HTMLElement | null>, isDisabled = false) =>
        useBorderBoxSize(ref, isDisabled).height;

    /**
     * Watches whether an element is on screen.
     *
     * @param ref The element to watch.
     * @param isDisabled Pass `true` to stop watching.
     * @returns Whether any part of the element is visible. `false` before the element exists, while disabled, and
     * until the observer first reports.
     */
    export const useViewportIntersection = (ref: RefObject<HTMLElement | null>, isDisabled = false) => {
        const element = useElement(ref);
        const [isIntersecting, setIsIntersecting] = useState(false);

        useLayoutEffect(() => {
            setIsIntersecting(false);

            if (!element || isDisabled) return;

            return ElementObserverUtils.observeViewportIntersection(element, setIsIntersecting);
        }, [element, isDisabled]);

        return isIntersecting;
    };

    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * One measurement is taken as the element mounts whatever `isVisible` says, and the frame loop and listeners of
     * `ElementObserverUtils.observeViewportRect` run while it says `true`.
     *
     * @param ref The element to measure.
     * @param isVisible Whether to keep measuring.
     * @param opts.padding Grows the rectangle outwards, either evenly or edge by edge.
     * @param opts.offset Shifts the rectangle. Applied after the padding.
     * @returns The rectangle, or `undefined` before the element has been measured.
     */
    export const useViewportRect = (
        ref: RefObject<HTMLElement | null>,
        isVisible: boolean,
        opts?: { padding?: Bounds | number; offset?: Point2d },
    ) => {
        const viewportContext = useViewportContext();
        const element = useElement(ref);
        const latest = useLatest(opts);
        const [rect, setRect] = useDedupedState<Rect | undefined>(undefined, isSameRect);

        useLayoutEffect(() => {
            if (!element) return;

            setRect(ElementObserverUtils.measureViewportRect(element, viewportContext, latest.current));
        }, [element, viewportContext, latest]);

        useLayoutEffect(() => {
            if (!element || !isVisible) return;

            return ElementObserverUtils.observeViewportRect(() => element, viewportContext, setRect, {
                getPadding: () => latest.current?.padding ?? 0,
                getOffset: () => latest.current?.offset ?? { x: 0, y: 0 },
            });
        }, [element, isVisible, viewportContext, latest]);

        return rect;
    };

    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * @param elements The elements to measure, in the order the rects should come back. A missing entry is kept as
     * `undefined`. A list with the same entries as last render counts as unchanged.
     * @param isVisible Whether to keep measuring.
     * @returns One rect per element, measured once as the list arrives and every frame while visible.
     */
    export const useViewportRects = (elements: Array<HTMLElement | undefined>, isVisible: boolean) => {
        const viewportContext = useViewportContext();
        const stableElements = useStableList(elements);
        const [rects, setRects] = useDedupedState(EMPTY_RECTS, isSameRectList);

        useLayoutEffect(() => {
            setRects(ElementObserverUtils.measureViewportRects(stableElements, viewportContext));
        }, [stableElements, viewportContext]);

        useLayoutEffect(() => {
            if (!isVisible) return;

            return ElementObserverUtils.observeViewportRects(() => stableElements, viewportContext, setRects);
        }, [stableElements, isVisible, viewportContext]);

        return rects;
    };

    /**
     * Follows which of a list of elements the reader has scrolled to, in viewport coordinates.
     *
     * @param elements The elements to follow, in reading order. A missing entry is never current.
     * @param isDisabled Pass `true` to stop following.
     * @param opts.offsetRatio Where the line sits, as a share of the viewport's height from its top.
     * @returns The current element's index, or `undefined` while none has passed the line and while disabled.
     */
    export const useCurrentIndex = (
        elements: Array<HTMLElement | undefined>,
        isDisabled = false,
        opts?: { offsetRatio?: number },
    ) => {
        const viewportContext = useViewportContext();
        const stableElements = useStableList(elements);
        const [index, setIndex] = useState<number>();
        const offsetRatio = opts?.offsetRatio;

        useLayoutEffect(() => {
            if (isDisabled) {
                setIndex(undefined);

                return;
            }

            return ElementObserverUtils.observeCurrentIndex(stableElements, viewportContext, setIndex, { offsetRatio });
        }, [stableElements, isDisabled, offsetRatio, viewportContext]);

        return index;
    };

    /**
     * Follows how far an element has traveled through the viewport as the page scrolls.
     *
     * @param ref The element to follow.
     * @param isDisabled Pass `true` to stop following.
     * @returns `0` while the element has yet to come up from below the viewport, `1` once it has left through the
     * top, and the share in between. `0` before the element exists and while disabled.
     */
    export const useViewportProgress = (ref: RefObject<HTMLElement | null>, isDisabled = false) => {
        const viewportContext = useViewportContext();
        const element = useElement(ref);
        const [progress, setProgress] = useState(0);

        useLayoutEffect(() => {
            if (!element || isDisabled) {
                setProgress(0);

                return;
            }

            return ElementObserverUtils.observeViewportProgress(element, viewportContext, setProgress);
        }, [element, isDisabled, viewportContext]);

        return progress;
    };

    /**
     * Follows how far an element has traveled through a scrolling box as the box scrolls.
     *
     * @param ref The element to follow.
     * @param containerRef The scrolling box it travels through.
     * @param isDisabled Pass `true` to stop following.
     * @returns The share of the passage across the box's visible area covered, as
     * `ElementObserverUtils.observeScrollContainerProgress` gives it. `0` before either element exists and while
     * disabled.
     */
    export const useScrollContainerProgress = (
        ref: RefObject<HTMLElement | null>,
        containerRef: RefObject<HTMLElement | null>,
        isDisabled = false,
    ) => {
        const viewportContext = useViewportContext();
        const element = useElement(ref);
        const container = useElement(containerRef);
        const [progress, setProgress] = useState(0);

        useLayoutEffect(() => {
            if (!element || !container || isDisabled) {
                setProgress(0);

                return;
            }

            return ElementObserverUtils.observeScrollContainerProgress(
                element,
                () => container,
                viewportContext,
                setProgress,
            );
        }, [element, container, isDisabled, viewportContext]);

        return progress;
    };
}
