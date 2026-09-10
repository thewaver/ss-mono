import type { Accessor, Setter } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { Bounds, type Point2d, type Rect, Size2d } from "@thewaver/ss-utils";

import { useViewportContext } from "../Viewport/Viewport.context";
import { ViewportUtils } from "../Viewport/Viewport.utils";

/** Shared empty result, so a disabled observer does not hand out a new array each time. */
const EMPTY_SIZES: Size2d[] = [];

/** Whether two size lists match entry for entry. */
const isSameSizeList = (a: Size2d[], b: Size2d[]) =>
    a.length === b.length && a.every((size, index) => Size2d.isSame(size, b[index]));

/**
 * Reports an element's size and position as reactive accessors, and keeps them current.
 *
 * Wrappers around `ResizeObserver` and `IntersectionObserver` that fit Solid's shape: an accessor
 * in, an accessor out, observers torn down on cleanup. Each takes an optional enabled accessor so a
 * component that is off screen or collapsed can stop measuring, and each de-duplicates its results,
 * so a resize that does not change the numbers does not wake anything downstream.
 */
export namespace ElementObserverUtils {
    /**
     * Watches an element's size, borders and padding included.
     *
     * @param getRef The element to watch. Nothing is measured until it exists.
     * @param getIsEnabled Pass `false` to stop watching. Omitted means always on.
     * @returns The current size, starting from an immediate measurement rather than waiting for the
     * first observer callback. Zeroes before the element exists.
     */
    export const createBorderBoxSizeObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsEnabled?: Accessor<boolean>,
    ) => {
        const [getSize, setSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsEnabled?.() === false) return;

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
     * @param getIsEnabled Pass `false` to stop watching. Omitted means always on.
     * @returns One size per element.
     */
    export const createBorderBoxSizeListObserver = (
        getRefs: Accessor<Array<HTMLElement | undefined>>,
        getIsEnabled?: Accessor<boolean>,
    ) => {
        const [getSizes, setSizes] = createSignal<Size2d[]>(EMPTY_SIZES, { equals: isSameSizeList });

        createEffect(() => {
            const refs = getRefs();

            if (getIsEnabled?.() === false) {
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
     * @param getIsEnabled Pass `false` to stop watching. Omitted means always on.
     * @returns The current height. Changes only when the height does, so a width-only resize wakes
     * nothing.
     */
    export const createBorderBoxHeightObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsEnabled?: Accessor<boolean>,
    ) => {
        const getSize = createBorderBoxSizeObserver(getRef, getIsEnabled);

        return createMemo(() => getSize().height);
    };

    /**
     * Watches whether an element is on screen.
     *
     * @param getRef The element to watch.
     * @param getIsEnabled Pass `false` to stop watching. Omitted means always on.
     * @returns Whether any part of the element is currently visible. `false` before the element exists,
     * while disabled, and until the observer first reports.
     */
    export const createViewportIntersectionObserver = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsEnabled?: Accessor<boolean>,
    ) => {
        const [getIsIntersecting, setIsIntersecting] = createSignal(false);

        createEffect(() => {
            const ref = getRef();

            setIsIntersecting(false);

            if (!ref || getIsEnabled?.() === false) return;

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
            let isCancelled = false;

            onCleanup(() => {
                isCancelled = true;
                cancelAnimationFrame(frameId);
            });

            if (!getIsVisible()) return;

            const tick = () => {
                if (isCancelled) return;

                updateSize();

                frameId = requestAnimationFrame(tick);
            };

            frameId = requestAnimationFrame(tick);
        });
    };
}
