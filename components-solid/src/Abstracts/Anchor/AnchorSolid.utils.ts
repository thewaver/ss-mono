import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { type AnchorPlacement, AnchorUtils } from "@thewaver/ss-components";
import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../ElementObserver/ElementObserverSolid.utils";
import { ElevationSolidUtils } from "../Elevation/ElevationSolid.utils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** The Solid side of {@link AnchorUtils}: the positioning cycle for portaled content, as reactive accessors. */
export namespace AnchorSolidUtils {
    /**
     * Runs the whole positioning cycle for portaled content, as reactive accessors.
     *
     * This is the piece a popover-shaped component actually uses. It measures the anchor and the
     * content, chooses a placement that fits, clamps the result into the free space, and reports a
     * `z-index` that clears both the document's own stacking and any registered layer. Everything
     * re-runs as the anchor moves, the content resizes or the viewport changes, and observers are torn
     * down while the content is hidden so a closed popup costs nothing. The arithmetic is
     * {@link AnchorUtils.computePortalPlacement}, {@link AnchorUtils.computePortalPosition} and their neighbors.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getAnchorRef The element to position against.
     * @param getIsVisible Whether the content is currently shown. Measuring stops when it is not.
     * @param opts.getPlacement The placement to aim for.
     * @param opts.getOffset The gap to hold between anchor and content.
     * @param opts.getReservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.getAnchorRect Supplies the anchor rectangle directly, for content anchored to
     * something that is not an element — a caret position, a pointer, a cell in a canvas. Given this,
     * no element is observed.
     * @param opts.getIsPinned Keeps the placement the caller asked for and skips clamping, for content
     * that should be allowed to run off screen rather than move.
     * @returns `getAnchorRect` and `getIsAnchorOnScreen` for deciding whether to draw at all,
     * `getPlacement` for styling that depends on which way the content opened, `getPosition` for where
     * to put it, `getZIndex`, and `setContentRef`, which must be attached to the content's own element
     * for any of the rest to have a size to work with. `getPosition` is `undefined` until both anchor
     * and content have been measured.
     */
    export const createPortalPosition = (
        getAnchorRef: Accessor<HTMLElement | undefined>,
        getIsVisible: Accessor<boolean>,
        opts: {
            getPlacement: Accessor<AnchorPlacement>;
            getOffset?: () => Point2d;
            getReservedScreenSize?: () => Size2d;
            getAnchorRect?: () => Rect | undefined;
            getIsPinned?: () => boolean;
        },
    ) => {
        const viewportContext = useViewportContext();

        const [getContentRef, setContentRef] = createSignal<HTMLElement>();
        const [getContentSize, setContentSize] = createSignal<Size2d | undefined>(undefined, {
            equals: Size2d.isSame,
        });
        const [getObservedRect, setAnchorRect] = createSignal<Rect | undefined>(undefined, {
            equals: Rect.isSame,
        });

        const getAnchorRect = createMemo(() => opts.getAnchorRect?.() ?? getObservedRect());

        const getLayoutOpts = () => ({
            offset: opts.getOffset?.(),
            reservedScreenSize: opts.getReservedScreenSize?.(),
            isPinned: opts.getIsPinned?.(),
        });

        const getPlacement = createMemo(() =>
            AnchorUtils.computePortalPlacement(
                opts.getPlacement(),
                getAnchorRect(),
                getContentSize(),
                viewportContext.getSize(),
                getLayoutOpts(),
            ),
        );

        const getPosition = createMemo(() =>
            AnchorUtils.computePortalPosition(
                getPlacement(),
                getAnchorRect(),
                getContentSize(),
                viewportContext.getSize(),
                getLayoutOpts(),
            ),
        );

        const getIsAnchorOnScreen = createMemo(() =>
            AnchorUtils.getIsAnchorOnScreen(getAnchorRect(), viewportContext.getSize()),
        );

        const getZIndex = createMemo(() => {
            if (!getIsVisible()) return 1;

            const anchorRef = getAnchorRef();

            return Math.max(AnchorUtils.getStackingBase(anchorRef), ElevationSolidUtils.getBase(anchorRef)) + 1;
        });

        ElementObserverSolidUtils.createViewportRectObserver(
            getAnchorRef,
            () => getIsVisible() && !opts.getAnchorRect,
            {
                setElementRect: setAnchorRect,
            },
        );

        createEffect(() => {
            onCleanup(() => {
                setContentSize(undefined);
            });

            const contentRef = getContentRef();
            const isVisible = getIsVisible();

            if (!contentRef || !isVisible) return;

            onCleanup(AnchorUtils.observeContentSize(contentRef, setContentSize));
        });

        return { getAnchorRect, getIsAnchorOnScreen, getPlacement, getPosition, getZIndex, setContentRef };
    };
}
