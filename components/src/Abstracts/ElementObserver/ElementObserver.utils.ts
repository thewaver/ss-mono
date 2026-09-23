import type { Accessor, Setter } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { Bounds, type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { useViewportContext } from "../Viewport/Viewport.context";
import { ViewportUtils } from "../Viewport/Viewport.utils";
import { CURRENT_INDEX_OBSERVER_DEFAULTS } from "./ElementObserver.const";

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
 * Reports an element's size and position as reactive accessors, and keeps them current.
 *
 * Wrappers around `ResizeObserver` and `IntersectionObserver` that fit Solid's shape: an accessor
 * in, an accessor out, observers torn down on cleanup. Each takes an optional disabled accessor so a
 * component that is off screen or collapsed can stop measuring, and each de-duplicates its results,
 * so a resize that does not change the numbers does not wake anything downstream.
 */
export namespace ElementObserverUtils {
    /**
     * Watches an element's size, borders and padding included.
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

            setSize({ width: ref.offsetWidth, height: ref.offsetHeight });

            const observer = new ResizeObserver(([entry]) => {
                setSize({
                    width: entry.borderBoxSize[0].inlineSize,
                    height: entry.borderBoxSize[0].blockSize,
                });
            });

            observer.observe(ref);

            onCleanup(() => {
                observer.disconnect();
            });
        });

        return getSize;
    };

    /**
     * Watches several elements' sizes at once.
     *
     * One observer covers the whole list, and the whole list is re-measured whenever any of them
     * changes, which keeps the entries consistent with each other — important when the sizes are being
     * compared or summed, as in a toolbar deciding what fits.
     *
     * @param getRefs The elements to watch, in the order the sizes should come back. Missing entries
     * are kept as zeroes rather than dropped, so the result always lines up with the input.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns One size per element.
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

            const measure = () =>
                setSizes(refs.map((ref) => ({ width: ref?.offsetWidth ?? 0, height: ref?.offsetHeight ?? 0 })));

            measure();

            const observer = new ResizeObserver(measure);

            for (const ref of refs) {
                if (ref) observer.observe(ref);
            }

            onCleanup(() => {
                observer.disconnect();
            });
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

            const observer = new IntersectionObserver(([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            });

            observer.observe(ref);

            onCleanup(() => {
                observer.disconnect();
            });
        });

        return getIsIntersecting;
    };

    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * Scroll and resize events are listened for, but they are not enough: an element can also move
     * because an ancestor was transformed, because a layout animation is running, or because something
     * above it grew. Nothing reports those, so this re-measures on every animation frame while the
     * element is visible. That is deliberate and it is why the visibility accessor matters — the loop
     * stops as soon as the element is hidden.
     *
     * The rectangle comes back in the enclosing viewport's coordinates rather than the screen's, so it
     * is correct inside a zoomed or panned `Viewport`.
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

        const updateSize = () => {
            const ref = getRef();

            if (!ref) return;

            const elementRect = ViewportUtils.getAdjustedBoundingClientRect(ref, viewportContext);
            const offset = opts.getOffset?.() ?? { x: 0, y: 0 };
            const padding = opts.getPadding?.() ?? 0;
            const spreadPadding = typeof padding === "number" ? Bounds.spread(padding) : padding;

            opts.setElementRect({
                x: elementRect.x - spreadPadding.left - offset.x,
                y: elementRect.y - spreadPadding.top - offset.y,
                width: elementRect.width + spreadPadding.left + spreadPadding.right,
                height: elementRect.height + spreadPadding.top + spreadPadding.bottom,
            });
        };

        onMount(() => {
            updateSize();
        });

        createEffect(() => {
            onCleanup(() => {
                document.removeEventListener("scroll", updateSize, true);
                window.removeEventListener("resize", updateSize);
            });

            if (!getIsVisible()) return;

            document.addEventListener("scroll", updateSize, { capture: true, passive: true });
            window.addEventListener("resize", updateSize);
        });

        createEffect(() => {
            let frameId: ReturnType<typeof requestAnimationFrame>;
            let isCanceled = false;

            onCleanup(() => {
                isCanceled = true;
                cancelAnimationFrame(frameId);
            });

            if (!getIsVisible()) return;

            const tick = () => {
                if (isCanceled) return;

                updateSize();

                frameId = requestAnimationFrame(tick);
            };

            frameId = requestAnimationFrame(tick);
        });
    };

    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * The list version of {@link createViewportRectObserver}: one set of listeners and one frame loop
     * covers every element, which is what lets a consumer with an unbounded number of targets — a
     * spawner aiming at however many are on screen — read each one's current rect without measuring
     * on its own, on demand, in the middle of some other loop.
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

        const updateRects = () => {
            setRects(
                getRefs().map((ref) =>
                    ref ? ViewportUtils.getAdjustedBoundingClientRect(ref, viewportContext) : undefined,
                ),
            );
        };

        onMount(() => {
            updateRects();
        });

        createEffect(() => {
            onCleanup(() => {
                document.removeEventListener("scroll", updateRects, true);
                window.removeEventListener("resize", updateRects);
            });

            if (!getIsVisible()) return;

            document.addEventListener("scroll", updateRects, { capture: true, passive: true });
            window.addEventListener("resize", updateRects);
        });

        createEffect(() => {
            let frameId: ReturnType<typeof requestAnimationFrame>;
            let isCanceled = false;

            onCleanup(() => {
                isCanceled = true;
                cancelAnimationFrame(frameId);
            });

            if (!getIsVisible()) return;

            const tick = () => {
                if (isCanceled) return;

                updateRects();

                frameId = requestAnimationFrame(tick);
            };

            frameId = requestAnimationFrame(tick);
        });

        return getRects;
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

            const update = () => {
                const line = viewportContext.getSize().height * offsetRatio;
                const tops = refs.map((ref) =>
                    ref ? ViewportUtils.getAdjustedBoundingClientRect(ref, viewportContext).y : undefined,
                );

                setIndex(computeCurrentIndex(tops, line));
            };

            update();

            document.addEventListener("scroll", update, { capture: true, passive: true });
            window.addEventListener("resize", update);

            onCleanup(() => {
                document.removeEventListener("scroll", update, true);
                window.removeEventListener("resize", update);
            });
        });

        return getIndex;
    };
}
