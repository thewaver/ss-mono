import { type RefObject, useEffect, useLayoutEffect, useMemo, useReducer, useState } from "react";

import {
    type AnchorPlacement,
    AnchorUtils,
    ElementObserverUtils,
    ElevationUtils,
    type NavigatorDirection,
} from "@thewaver/ss-components";
import { type Point2d, type Rect, Size2d } from "@thewaver/ss-utils";

import { useElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { ElementObserverReactUtils } from "../ElementObserver/ElementObserverReact.utils";
import { NavigatorReactUtils } from "../Navigator/NavigatorReact.utils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** Re-renders whenever the window is resized, since the viewport's size is read during rendering. */
const useWindowResize = () => {
    const [, bump] = useReducer((count: number) => count + 1, 0);

    useEffect(() => {
        window.addEventListener("resize", bump);

        return () => window.removeEventListener("resize", bump);
    }, []);
};

/** The React side of `AnchorUtils`: the positioning cycle for portaled content, as state. */
export namespace AnchorReactUtils {
    /**
     * Runs the whole positioning cycle for portaled content.
     *
     * It measures the anchor and the content, chooses a placement that fits, clamps the result into the free space,
     * and reports a `z-index` that clears both the document's own stacking and any registered layer. Measuring stops
     * while the content is hidden, so a closed popup costs nothing. The arithmetic is
     * `AnchorUtils.computePortalPlacement`, `AnchorUtils.computePortalPosition` and their neighbors.
     *
     * The content also takes the direction text runs in at the anchor, written as `dir` on the element handed to
     * `setContentRef` and kept current while it is shown, since content moved to the end of the document would
     * otherwise lay itself out in the document's direction rather than its anchor's.
     *
     * @param anchorRef The element to position against, and whose direction the content takes. Content given only
     * `opts.anchorRect` and no element runs left to right.
     * @param isVisible Whether the content is currently shown.
     * @param opts.computePlacement The placement to aim for, given the direction text runs in at the anchor, so a
     * default can line the content up with the edge the text starts from.
     * @param opts.offset The gap to hold between anchor and content.
     * @param opts.reservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.anchorRect Supplies the anchor rectangle directly, for content anchored to something that is not
     * an element. Given this, no element is observed.
     * @param opts.isPinned Keeps the placement asked for and skips clamping.
     * @returns `anchorRect` and `isAnchorOnScreen` for deciding whether to draw at all, `direction` for the direction
     * the content was given, `placement` for styling
     * that depends on which way the content opened, `position` for where to put it, `arrowAim` for where an arrow
     * pointing at the anchor leaves the content (see {@link AnchorUtils.computeArrowAim}), `zIndex`, and
     * `setContentRef`, a ref callback for the content's own element, without which nothing has a size to work with.
     * `position` is `undefined` until both anchor and content have been measured.
     */
    export const usePortalPosition = (
        anchorRef: RefObject<HTMLElement | null>,
        isVisible: boolean,
        opts: {
            computePlacement: (direction: NavigatorDirection) => AnchorPlacement;
            offset?: Point2d;
            reservedScreenSize?: Size2d;
            anchorRect?: Rect;
            isPinned?: boolean;
        },
    ) => {
        useWindowResize();

        const viewportContext = useViewportContext();
        const anchor = useElement(anchorRef);
        const layers = useStore(ElevationUtils.registeredLayers);
        const [contentElement, setContentRef] = useState<HTMLElement | null>(null);
        const [contentSize, setContentSize] = useState<Size2d>();
        const direction = NavigatorReactUtils.useDirection(anchorRef, !isVisible);

        const observedRect = ElementObserverReactUtils.useViewportRect(anchorRef, isVisible && !opts.anchorRect);
        const anchorRect = opts.anchorRect ?? observedRect;
        const screenSize = viewportContext.getSize();
        const layoutOpts = {
            offset: opts.offset,
            reservedScreenSize: opts.reservedScreenSize,
            isPinned: opts.isPinned,
        };

        const placement = AnchorUtils.computePortalPlacement(
            opts.computePlacement(direction),
            anchorRect,
            contentSize,
            screenSize,
            layoutOpts,
        );
        const position = AnchorUtils.computePortalPosition(placement, anchorRect, contentSize, screenSize, layoutOpts);
        const arrowAim = AnchorUtils.computeArrowAim(placement, anchorRect, position, contentSize);

        const zIndex = useMemo(
            () => (isVisible ? Math.max(AnchorUtils.getStackingBase(anchor), ElevationUtils.getBase(anchor)) + 1 : 1),
            [isVisible, anchor, layers],
        );

        useLayoutEffect(() => {
            if (!contentElement || !isVisible) return;

            const stop = ElementObserverUtils.observeBorderBoxSize(
                contentElement,
                (size) => setContentSize((previous) => (previous && Size2d.isSame(previous, size) ? previous : size)),
                false,
            );

            return () => {
                stop();
                setContentSize(undefined);
            };
        }, [contentElement, isVisible]);

        useLayoutEffect(() => {
            if (!contentElement) return;

            contentElement.dir = direction;
        }, [contentElement, direction]);

        return {
            anchorRect,
            isAnchorOnScreen: AnchorUtils.getIsAnchorOnScreen(anchorRect, screenSize),
            placement,
            position,
            arrowAim,
            direction,
            zIndex,
            setContentRef,
        };
    };
}
