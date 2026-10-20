import { Point2d } from "../../Abstracts/point2d.js";

const REVEAL_PASSES = 2;

const getRevealShift = (viewStart: number, viewSize: number, itemStart: number, itemSize: number) => {
    const startShift = itemStart - viewStart;
    const endShift = itemStart + itemSize - (viewStart + viewSize);

    if (startShift < 0) return startShift;
    if (endShift > 0) return Math.min(startShift, endShift);

    return 0;
};

const getScrollPadding = (value: string) => (value.endsWith("px") ? Number.parseFloat(value) : 0);

const revealIn = (scroller: HTMLElement, element: HTMLElement) => {
    const canScrollX = scroller.scrollWidth > scroller.clientWidth;
    const canScrollY = scroller.scrollHeight > scroller.clientHeight;

    if ((!canScrollX && !canScrollY) || scroller.offsetWidth === 0) return;

    const style = getComputedStyle(scroller);
    const padLeft = getScrollPadding(style.scrollPaddingLeft);
    const padRight = getScrollPadding(style.scrollPaddingRight);
    const padTop = getScrollPadding(style.scrollPaddingTop);
    const padBottom = getScrollPadding(style.scrollPaddingBottom);

    for (let pass = 0; pass < REVEAL_PASSES; pass++) {
        const scrollerRect = scroller.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scale = scrollerRect.width / scroller.offsetWidth;

        if (canScrollX) {
            const viewStart = scrollerRect.left + (scroller.clientLeft + padLeft) * scale;
            const viewSize = (scroller.clientWidth - padLeft - padRight) * scale;

            scroller.scrollLeft += getRevealShift(viewStart, viewSize, elementRect.left, elementRect.width) / scale;
        }

        if (canScrollY) {
            const viewStart = scrollerRect.top + (scroller.clientTop + padTop) * scale;
            const viewSize = (scroller.clientHeight - padTop - padBottom) * scale;

            scroller.scrollTop += getRevealShift(viewStart, viewSize, elementRect.top, elementRect.height) / scale;
        }
    }
};

export namespace DOMUtils {
    /**
     * Finds how much larger or smaller an element is drawn than its own layout says — the scale a CSS transform
     * on it or on any ancestor applies.
     *
     * Read from the width, so a transform that stretches one axis more than the other reports the horizontal
     * stretch.
     *
     * @param element The element to measure.
     * @param box Its `getBoundingClientRect()`, when the caller already has it. Measured here otherwise.
     * @returns The drawn width over the layout width, or `1` for an element with no width.
     */
    export const getScreenScale = (element: HTMLElement, box: DOMRect = element.getBoundingClientRect()) =>
        element.offsetWidth > 0 ? box.width / element.offsetWidth : 1;

    /**
     * Scrolls an element into view by moving only the scrollers between it and `root`, never the page.
     *
     * Each scroller from the element's parent up to and including `root` moves by the least that shows the
     * element clear of its `scroll-padding`, as `scrollIntoView({ block: "nearest" })` does, and nothing outside
     * `root` moves. Distances are converted into each scroller's own layout pixels, so content drawn scaled by a
     * transform scrolls by the right amount.
     *
     * @param element The element to show.
     * @param root The outermost element allowed to scroll. Nothing moves when `element` is not inside it.
     */
    export const revealWithin = (element: HTMLElement, root: HTMLElement) => {
        if (!root.contains(element)) return;

        for (let scroller = element.parentElement; scroller; scroller = scroller.parentElement) {
            revealIn(scroller, element);

            if (scroller === root) return;
        }
    };

    /**
     * Shifts a measured rectangle by an offset.
     *
     * `getBoundingClientRect` reports positions relative to the viewport. Subtracting a
     * container's own position converts those into positions relative to that
     * container.
     *
     * @param rect The rectangle to shift. Returned untouched if missing.
     * @param offset How far to shift it. Returned untouched if missing.
     * @returns A new `DOMRect`. The original is not modified.
     */
    export const offsetDOMRect = (rect: DOMRect | undefined, offset: Point2d | undefined): DOMRect | undefined => {
        if (!rect || !offset) return rect;

        return DOMRect.fromRect({
            x: rect.x - offset.x,
            y: rect.y - offset.y,
            width: rect.width,
            height: rect.height,
        });
    };

    /**
     * Scales a measured rectangle about the origin.
     *
     * Both the position and the size are scaled, which is what converts a measurement
     * taken on screen into the coordinates of a zoomed or transformed canvas.
     *
     * @param rect The rectangle to scale. Returned untouched if missing.
     * @param scale What to multiply by.
     * @returns A new `DOMRect`. The original is not modified.
     */
    export const scaleDOMRect = (rect: DOMRect | undefined, scale: number): DOMRect | undefined => {
        if (!rect) return rect;

        return DOMRect.fromRect({
            x: rect.x * scale,
            y: rect.y * scale,
            width: rect.width * scale,
            height: rect.height * scale,
        });
    };
}
