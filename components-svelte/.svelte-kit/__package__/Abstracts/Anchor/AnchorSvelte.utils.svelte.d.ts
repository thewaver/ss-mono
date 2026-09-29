import type { Attachment } from "svelte/attachments";
import { type AnchorPlacement } from "@thewaver/ss-components";
import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";
/** The Svelte side of {@link AnchorUtils}: the positioning cycle for portaled content, as getters. */
export declare namespace AnchorSvelteUtils {
    /**
     * Runs the whole positioning cycle for portaled content, as getters.
     *
     * This is the piece a popover-shaped component actually uses. It measures the anchor and the content, chooses a
     * placement that fits, clamps the result into the free space, and reports a `z-index` that clears both the
     * document's own stacking and any registered layer. Everything re-runs as the anchor moves, the content resizes
     * or the viewport changes, and observers are torn down while the content is hidden so a closed popup costs
     * nothing. The arithmetic is {@link AnchorUtils.computePortalPlacement}, {@link AnchorUtils.computePortalPosition}
     * and their neighbors.
     *
     * Must run while a component is being set up.
     *
     * @param getAnchorRef The element to position against.
     * @param getIsVisible Whether the content is currently shown. Measuring stops when it is not.
     * @param opts.getPlacement The placement to aim for.
     * @param opts.getOffset The gap to hold between anchor and content.
     * @param opts.getReservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.getAnchorRect Supplies the anchor rectangle directly, for content anchored to something that is
     * not an element — a caret position, a pointer, a cell in a canvas. While it answers a rectangle, no element is
     * observed.
     * @param opts.getIsPinned Keeps the placement the caller asked for and skips clamping, for content that should
     * be allowed to run off screen rather than move.
     * @returns `getAnchorRect` and `getIsAnchorOnScreen` for deciding whether to draw at all, `getPlacement` for
     * styling that depends on which way the content opened, `getPosition` for where to put it, `getZIndex`, and
     * `attachContent`, which must be attached to the content's own element with `{@attach}` for any of the rest to
     * have a size to work with. `getPosition` is `undefined` until both anchor and content have been measured.
     */
    const createPortalPosition: (getAnchorRef: () => HTMLElement | undefined, getIsVisible: () => boolean, opts: {
        getPlacement: () => AnchorPlacement;
        getOffset?: () => Point2d | undefined;
        getReservedScreenSize?: () => Size2d | undefined;
        getAnchorRect?: () => Rect | undefined;
        getIsPinned?: () => boolean;
    }) => {
        getAnchorRect: () => Rect | undefined;
        getIsAnchorOnScreen: () => boolean;
        getPlacement: () => AnchorPlacement;
        getPosition: () => Point2d | undefined;
        getZIndex: () => number;
        attachContent: Attachment<HTMLElement>;
    };
}
