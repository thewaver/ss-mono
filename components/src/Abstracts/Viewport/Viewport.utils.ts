import { DOMUtils, type Point2d, type Rect } from "@thewaver/ss-utils";

import type { ViewportContextType } from "./Viewport.context.types";

/**
 * Converts between screen coordinates and the coordinates of a scaled, scrolled viewport.
 *
 * A `Viewport` draws its contents under a transform, so `getBoundingClientRect` and a pointer
 * event both report positions in screen pixels that mean nothing to the content inside. These undo
 * that transform, and compose one viewport's transform onto another's for the nested case.
 */
export namespace ViewportUtils {
    /**
     * Measures an element in its viewport's own coordinates rather than the screen's.
     *
     * Use this in place of `getBoundingClientRect` for anything drawn inside a viewport: the result is
     * where the element sits in the unscaled content, which is what a layout or a hit test wants.
     *
     * @param child The element to measure. It must be inside the viewport it is measured against.
     * @param viewportContext The viewport it is drawn in.
     * @returns A new `DOMRect` in content coordinates.
     */
    export const getAdjustedBoundingClientRect = (child: Element, viewportContext: ViewportContextType) => {
        const viewportRect = viewportContext.getScaledRect();
        const viewportScale = 1 / viewportContext.getScale();

        return DOMUtils.scaleDOMRect(
            DOMUtils.offsetDOMRect(child.getBoundingClientRect(), viewportRect),
            viewportScale,
        )!;
    };

    /**
     * Converts a screen point into a viewport's own coordinates.
     *
     * Pointer events report `clientX` and `clientY` in screen pixels, so a drag inside a zoomed
     * viewport moves the pointer further than it moves the content. This gives the point the content
     * actually sees.
     *
     * @param point A point in screen coordinates, typically taken from a pointer event.
     * @param viewportContext The viewport the point was over.
     * @returns The same point in content coordinates.
     */
    export const getAdjustedClientPoint = (point: Point2d, viewportContext: ViewportContextType): Point2d => {
        const viewportRect = viewportContext.getScaledRect();
        const viewportScale = 1 / viewportContext.getScale();

        return {
            x: (point.x - viewportRect.x) * viewportScale,
            y: (point.y - viewportRect.y) * viewportScale,
        };
    };

    /**
     * Places a child viewport's rectangle inside its parent's, carrying the parent's scale.
     *
     * Viewports nest, and each one only knows its own transform. Composing outwards, parent by parent,
     * is what gives the innermost viewport its true position and size on screen.
     *
     * @param rect The child's rectangle in its parent's coordinates.
     * @param parentRect Where the parent itself lands.
     * @param parentScale The scale the parent is drawn at.
     * @returns The child's rectangle in the parent's outer coordinate space.
     */
    export const composeScaledRect = (rect: Rect, parentRect: Rect, parentScale: number): Rect => ({
        x: parentRect.x + rect.x * parentScale,
        y: parentRect.y + rect.y * parentScale,
        width: rect.width * parentScale,
        height: rect.height * parentScale,
    });
}
