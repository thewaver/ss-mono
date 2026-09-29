import { Bounds, MathUtils, type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { ViewportContextType } from "../Viewport/Viewport.context.types";
import { ViewportUtils } from "../Viewport/Viewport.utils";
import { CURRENT_INDEX_OBSERVER_DEFAULTS } from "./ElementObserver.const";

/** Whether two size lists match entry for entry. */
const isSameSizeList = (a: Size2d[], b: Size2d[]) =>
    a.length === b.length && a.every((size, index) => Size2d.isSame(size, b[index]));

/** Whether two rect lists match entry for entry, an entry missing on both sides counting as a match. */
const isSameRectList = (a: (Rect | undefined)[], b: (Rect | undefined)[]) =>
    a.length === b.length &&
    a.every((rect, index) => (rect === undefined ? b[index] === undefined : Rect.isSame(rect, b[index])));

/** The share of an element's passage across a stretch of screen it has covered, `0`–`1`. */
const toPassageProgress = (top: number, height: number, spanHeight: number) => {
    const passage = spanHeight + height;

    if (passage <= 0) return 0;

    return MathUtils.clamp01((spanHeight - top) / passage);
};

/** Wraps a report so it is passed on only when the value differs from the last one passed on. */
const reportChanges = <T>(report: (value: T) => void, isSame: (a: T, b: T) => boolean = Object.is) => {
    let hasReported = false;
    let last: T;

    return (value: T) => {
        if (hasReported && isSame(last, value)) return;

        hasReported = true;
        last = value;
        report(value);
    };
};

/** Runs `update` now and on every scroll anywhere in the document and every resize, until the returned function is called. */
const followScroll = (update: () => void) => {
    update();

    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update);

    return () => {
        document.removeEventListener("scroll", update, true);
        window.removeEventListener("resize", update);
    };
};

/** Runs `update` now, then on every scroll, resize and animation frame, until the returned function is called. */
const followFrames = (update: () => void) => {
    update();

    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update);

    let frameId: ReturnType<typeof requestAnimationFrame>;
    let isCanceled = false;

    const tick = () => {
        if (isCanceled) return;

        update();

        frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
        isCanceled = true;
        cancelAnimationFrame(frameId);
        document.removeEventListener("scroll", update, true);
        window.removeEventListener("resize", update);
    };
};

/**
 * Follows an element's progress across a stretch of screen that `getSpan` measures, re-reading on any scroll in
 * the document and on resize. The span's top and the element's rect are both in layout space.
 */
const observePassageProgress = (
    element: HTMLElement,
    viewportContext: ViewportContextType,
    getSpan: () => { top: number; height: number } | undefined,
    onProgress: (progress: number) => void,
) => {
    const report = reportChanges(onProgress);

    return followScroll(() => {
        const span = getSpan();

        if (!span) return;

        const rect = ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext);

        report(toPassageProgress(rect.y - span.top, rect.height, span.height));
    });
};

/**
 * Reports an element's size and position, and keeps reporting as they change.
 *
 * Each `observe*` function starts watching, reports to a callback, and returns the function that stops it; each can
 * be started again afterwards. Every one but the per-frame rect reports only when the numbers change, so a resize
 * that leaves them alone wakes nothing downstream.
 */
export namespace ElementObserverUtils {
    /**
     * Watches an element's size, borders and padding included.
     *
     * @param element The element to watch.
     * @param onSize Called with the size: once straight away, from a measurement taken on the spot rather than
     * waiting for the first observer callback, and again whenever it changes.
     * @returns The function that stops watching.
     */
    export const observeBorderBoxSize = (element: HTMLElement, onSize: (size: Size2d) => void) => {
        const report = reportChanges(onSize, Size2d.isSame);

        report({ width: element.offsetWidth, height: element.offsetHeight });

        const observer = new ResizeObserver(([entry]) => {
            report({ width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize });
        });

        observer.observe(element);

        return () => observer.disconnect();
    };

    /**
     * Watches several elements' sizes at once.
     *
     * One observer covers the whole list, and the whole list is re-measured whenever any of them
     * changes, which keeps the entries consistent with each other — important when the sizes are being
     * compared or summed, as in a toolbar deciding what fits.
     *
     * @param elements The elements to watch, in the order the sizes should come back. Missing entries
     * are kept as zeroes rather than dropped, so the result always lines up with the input.
     * @param onSizes Called with one size per element, straight away and whenever any of them changes.
     * @returns The function that stops watching.
     */
    export const observeBorderBoxSizes = (
        elements: Array<HTMLElement | undefined>,
        onSizes: (sizes: Size2d[]) => void,
    ) => {
        const report = reportChanges(onSizes, isSameSizeList);

        const measure = () =>
            report(
                elements.map((element) => ({ width: element?.offsetWidth ?? 0, height: element?.offsetHeight ?? 0 })),
            );

        measure();

        const observer = new ResizeObserver(measure);

        for (const element of elements) {
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
    };

    /**
     * Watches whether an element is on screen.
     *
     * @param element The element to watch.
     * @param onChange Called with whether any part of the element is visible, when the observer first reports
     * and whenever that changes.
     * @returns The function that stops watching.
     */
    export const observeViewportIntersection = (element: HTMLElement, onChange: (isIntersecting: boolean) => void) => {
        const report = reportChanges(onChange);
        const observer = new IntersectionObserver(([entry]) => report(entry.isIntersecting));

        observer.observe(element);

        return () => observer.disconnect();
    };

    /**
     * Measures an element's position and size once, in its viewport's coordinates, grown and shifted as asked.
     *
     * @param element The element to measure.
     * @param viewportContext The viewport it is drawn in.
     * @param opts.padding Grows the rectangle outwards, either evenly or edge by edge. Useful for a hover target
     * that should extend past what is drawn.
     * @param opts.offset Shifts the rectangle. Applied after the padding.
     * @returns The rectangle.
     */
    export const measureViewportRect = (
        element: HTMLElement,
        viewportContext: ViewportContextType,
        opts?: { padding?: Bounds | number; offset?: Point2d },
    ): Rect => {
        const elementRect = ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext);
        const offset = opts?.offset ?? { x: 0, y: 0 };
        const padding = opts?.padding ?? 0;
        const spreadPadding = typeof padding === "number" ? Bounds.spread(padding) : padding;

        return {
            x: elementRect.x - spreadPadding.left - offset.x,
            y: elementRect.y - spreadPadding.top - offset.y,
            width: elementRect.width + spreadPadding.left + spreadPadding.right,
            height: elementRect.height + spreadPadding.top + spreadPadding.bottom,
        };
    };

    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * Scroll and resize events are listened for, but they are not enough: an element can also move
     * because an ancestor was transformed, because a layout animation is running, or because something
     * above it grew. Nothing reports those, so this re-measures on every animation frame until it is
     * stopped — stop it as soon as the element is hidden.
     *
     * The rectangle comes back in the enclosing viewport's coordinates rather than the screen's, so it
     * is correct inside a zoomed or panned `Viewport`. It is reported once straight away, from a measurement taken
     * as the call is made, and then on every frame, changed or not. So a caller that starts this as its content is
     * shown has a current rectangle before the browser paints, with no frame needed to supply it.
     *
     * @param getElement The element to measure, read at each measurement. Nothing is reported while it is missing.
     * @param viewportContext The viewport it is drawn in.
     * @param onRect Called with each measurement.
     * @param opts.getPadding As {@link measureViewportRect} takes `padding`, read at each measurement.
     * @param opts.getOffset As {@link measureViewportRect} takes `offset`, read at each measurement.
     * @returns The function that stops measuring.
     */
    export const observeViewportRect = (
        getElement: () => HTMLElement | undefined,
        viewportContext: ViewportContextType,
        onRect: (rect: Rect) => void,
        opts?: { getPadding?: () => Bounds | number; getOffset?: () => Point2d },
    ) =>
        followFrames(() => {
            const element = getElement();

            if (!element) return;

            onRect(
                measureViewportRect(element, viewportContext, {
                    padding: opts?.getPadding?.(),
                    offset: opts?.getOffset?.(),
                }),
            );
        });

    /**
     * Measures several elements' positions and sizes once, in viewport coordinates.
     *
     * @param elements The elements to measure. A missing entry comes back as `undefined`.
     * @param viewportContext The viewport they are drawn in.
     * @returns One rect per element, in the same order.
     */
    export const measureViewportRects = (
        elements: Array<HTMLElement | undefined>,
        viewportContext: ViewportContextType,
    ) =>
        elements.map((element) =>
            element ? ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext) : undefined,
        );

    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * The list version of {@link observeViewportRect}: one set of listeners and one frame loop
     * covers every element, which is what lets a consumer with an unbounded number of targets — a
     * spawner aiming at however many are on screen — read each one's current rect without measuring
     * on its own, on demand, in the middle of some other loop. Unlike the single version it reports only when
     * a rect has changed.
     *
     * @param getElements The elements to measure, read at each measurement, in the order the rects should come
     * back. A missing entry is kept as `undefined` rather than dropped, so the result always lines up with the
     * input.
     * @param viewportContext The viewport they are drawn in.
     * @param onRects Called with one rect per element: once straight away, and again whenever any of them changes.
     * @returns The function that stops measuring.
     */
    export const observeViewportRects = (
        getElements: () => Array<HTMLElement | undefined>,
        viewportContext: ViewportContextType,
        onRects: (rects: (Rect | undefined)[]) => void,
    ) => {
        const report = reportChanges(onRects, isSameRectList);

        return followFrames(() => report(measureViewportRects(getElements(), viewportContext)));
    };

    /**
     * Picks the current entry of a list from where each one's top sits against a line.
     *
     * The rule a table of contents follows: an entry becomes current once its top has scrolled up past the line,
     * and stays current until the next one does. Entries are expected in reading order.
     *
     * @param tops Each entry's top, in the same coordinates as `line`. A missing entry is never current.
     * @param line How far down the line sits.
     * @returns The last entry whose top is at or above the line, or `undefined` while none has reached it.
     */
    export const computeCurrentIndex = (tops: (number | undefined)[], line: number) => {
        let current: number | undefined;

        tops.forEach((top, index) => {
            if (top !== undefined && top <= line) current = index;
        });

        return current;
    };

    /**
     * Follows which of a list of elements the reader has scrolled to, in viewport coordinates.
     *
     * A line is drawn across the viewport at `offsetRatio` of its height from the top, and the current element is
     * the last one whose top has passed it, by {@link ElementObserverUtils.computeCurrentIndex}. It is re-read on
     * every scroll, anywhere in the document, and on every resize, which is what a table of contents marking
     * the section in view needs. Near the end of a page whose last section is shorter than the stretch below the
     * line, that section's top may never reach it; leave room after it if it has to become current.
     *
     * @param elements The elements to follow, in reading order. A missing entry is kept in place and never current.
     * @param viewportContext The viewport they are drawn in.
     * @param onIndex Called with the current element's index, or `undefined` while none has passed the line —
     * straight away, and whenever it changes.
     * @param opts.offsetRatio Where the line sits, as a share of the viewport's height from its top. Defaults to
     * `CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio`.
     * @returns The function that stops following.
     */
    export const observeCurrentIndex = (
        elements: Array<HTMLElement | undefined>,
        viewportContext: ViewportContextType,
        onIndex: (index: number | undefined) => void,
        opts?: { offsetRatio?: number },
    ) => {
        const report = reportChanges(onIndex);
        const offsetRatio = opts?.offsetRatio ?? CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio;

        return followScroll(() => {
            const line = viewportContext.getSize().height * offsetRatio;
            const tops = elements.map((element) =>
                element ? ViewportUtils.getAdjustedBoundingClientRect(element, viewportContext).y : undefined,
            );

            report(computeCurrentIndex(tops, line));
        });
    };

    /**
     * How far an element has traveled through a viewport of a given height, from `0` to `1`.
     *
     * `0` while the element's top is still at or below the viewport's bottom edge, `1` once its bottom has
     * gone past the top edge, and a straight line between the two, so the whole of the element's passage
     * across the screen is covered.
     *
     * @param top The element's top, measured from the viewport's top.
     * @param height The element's height, in the same space.
     * @param viewportHeight The viewport's height, in the same space.
     * @returns The share of the passage covered, clamped to `0`–`1`. `0` when there is no height to travel.
     */
    export const computeViewportProgress = (top: number, height: number, viewportHeight: number) =>
        toPassageProgress(top, height, viewportHeight);

    /**
     * Follows how far an element has traveled through the viewport as the page scrolls, in viewport coordinates.
     *
     * The number {@link ElementObserverUtils.computeViewportProgress} gives, re-read on every scroll anywhere in the
     * document and on every resize.
     *
     * @param element The element to follow.
     * @param viewportContext The viewport it is drawn in.
     * @param onProgress Called with `0` while the element has yet to come up from below the viewport, `1` once it
     * has left through the top, and the share in between while it crosses — straight away, and whenever it changes.
     * @returns The function that stops following.
     */
    export const observeViewportProgress = (
        element: HTMLElement,
        viewportContext: ViewportContextType,
        onProgress: (progress: number) => void,
    ) =>
        observePassageProgress(
            element,
            viewportContext,
            () => ({ top: 0, height: viewportContext.getSize().height }),
            onProgress,
        );

    /**
     * Follows how far an element has traveled through a scrolling box as the box scrolls, in the box's coordinates.
     *
     * {@link observeViewportProgress}'s answer, with the box's visible area standing in for the viewport:
     * `0` while the element's top is at or below the box's bottom edge, `1` once its bottom has gone past the top
     * edge. It still measures through the viewport's scale, so it holds inside a scaled `Viewport`.
     *
     * The visible area is the box's content height, inside its border and without a horizontal scrollbar. For the
     * whole range to be reachable, the box's content has to let the element start below the box and finish above
     * it — room of about one box height before and after it.
     *
     * @param element The element to follow.
     * @param getContainer The scrolling box it travels through, read at each measurement. Nothing is reported
     * while it is missing.
     * @param viewportContext The viewport both are drawn in.
     * @param onProgress Called with the share of the passage covered, straight away and whenever it changes.
     * @returns The function that stops following.
     */
    export const observeScrollContainerProgress = (
        element: HTMLElement,
        getContainer: () => HTMLElement | undefined,
        viewportContext: ViewportContextType,
        onProgress: (progress: number) => void,
    ) =>
        observePassageProgress(
            element,
            viewportContext,
            () => {
                const container = getContainer();

                if (!container) return undefined;

                const rect = ViewportUtils.getAdjustedBoundingClientRect(container, viewportContext);

                return { top: rect.y + container.clientTop, height: container.clientHeight };
            },
            onProgress,
        );
}
