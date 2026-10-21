/** The `overflow` values that make an element a scroller. */
const SCROLLING_OVERFLOWS = new Set(["auto", "scroll", "overlay"]);

const rectReporters = new WeakMap<object, () => void>();

/**
 * What a long list needs to draw only the rows on screen. The row window itself rides on a framework's own
 * virtualizer; what is framework-free is finding the scroller it measures against.
 */
export namespace VirtualizerUtils {
    /**
     * Finds the nearest ancestor that actually scrolls vertically.
     *
     * An ancestor counts when its computed `overflow-y` lets it scroll, whether or not it has anything to scroll
     * yet, so a list that has not grown long enough still finds the box it will scroll in.
     *
     * @param element The element to search up from. It is not itself a candidate.
     * @returns The scroller, or `undefined` when there is none — which is the signal that virtualizing
     * cannot work here and every row should be drawn.
     */
    export const findScrollParent = (element: HTMLElement) => {
        let ancestor = element.parentElement;

        while (ancestor) {
            if (SCROLLING_OVERFLOWS.has(getComputedStyle(ancestor).overflowY)) return ancestor;

            ancestor = ancestor.parentElement;
        }

        return undefined;
    };

    /**
     * Reports the size of the box a scroller shows its content in, now and whenever the scroller is resized.
     *
     * Stands in for TanStack's own `observeElementRect`, which reports the scroller's border box. A row scrolled to
     * the bottom edge is aligned against that size, so a scroller with a border, or a horizontal scrollbar, hid the
     * bottom of the row it had just scrolled to by that much — the row counted as in view while part of it was
     * clipped. The box reported here is the one the content is clipped to, which is what a scroll aligns with
     * natively.
     *
     * Typed by the parts of TanStack's virtualizer it reads, so it can be handed over as that option directly.
     *
     * @param instance The virtualizer, read for the scroller it is following and that scroller's window.
     * @param onRect Called with the visible box's width and height, in layout pixels.
     * @returns A function that stops observing, or nothing when there is no scroller to observe.
     */
    export const observeClientRect = (
        instance: {
            scrollElement: Element | null;
            targetWindow: { ResizeObserver?: typeof ResizeObserver } | null;
        },
        onRect: (rect: { width: number; height: number }) => void,
    ) => {
        const element = instance.scrollElement;
        const ResizeObserverOfWindow = instance.targetWindow?.ResizeObserver;

        if (!element || !instance.targetWindow) return undefined;

        const report = () => onRect({ width: element.clientWidth, height: element.clientHeight });

        report();
        rectReporters.set(instance, report);

        if (!ResizeObserverOfWindow) return () => rectReporters.delete(instance);

        const observer = new ResizeObserverOfWindow(report);

        observer.observe(element, { box: "border-box" });

        return () => {
            rectReporters.delete(instance);
            observer.disconnect();
        };
    };

    /**
     * Reports the scroller's visible box again, straight away, to a virtualizer that {@link observeClientRect} is
     * observing for.
     *
     * The observer reports a resize only after the browser has laid the page out, which is too late for a scroll
     * asked for in the same pass as the resize. A list opened onto a selection far down is exactly that: the
     * window takes up its scroller before the rows' spacer has been drawn, while the box is still a few pixels
     * tall, and the scroll to the selection follows once the spacer is in — so the row was aligned against the
     * old, tiny box and showed only its bottom edge until the observer caught up a frame later. Calling this
     * before scrolling aligns against the box as it is.
     *
     * @param instance The virtualizer, as handed to {@link observeClientRect}.
     */
    export const remeasureClientRect = (instance: object) => rectReporters.get(instance)?.();
}
