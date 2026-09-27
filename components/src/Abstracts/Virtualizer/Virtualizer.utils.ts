/** The `overflow` values that make an element a scroller. */
const SCROLLING_OVERFLOWS = new Set(["auto", "scroll", "overlay"]);

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
}
