import { untrack } from "svelte";
import { CURRENT_INDEX_OBSERVER_DEFAULTS, ElementObserverUtils } from "@thewaver/ss-components";
import { Rect, Size2d } from "@thewaver/ss-utils";
import { getViewportContext } from "../Viewport/Viewport.context.js";
const EMPTY_SIZES = [];
const EMPTY_RECTS = [];
const NO_SIZE = { width: 0, height: 0 };
const isSameSizeList = (a, b) => a.length === b.length && a.every((size, index) => Size2d.isSame(size, b[index]));
const isSameRectList = (a, b) => a.length === b.length &&
    a.every((rect, index) => (rect === undefined ? b[index] === undefined : Rect.isSame(rect, b[index])));
/**
 * The Svelte side of {@link ElementObserverUtils}: each observer as a getter in and a getter out, torn down with the
 * component.
 *
 * Each takes an optional disabled getter so a component that is off screen or collapsed can stop measuring, and
 * each skips a reading that has not changed, so a resize that does not change the numbers wakes nothing
 * downstream. Every measurement in viewport coordinates reads the nearest viewport context, or the window without
 * one. All of them must run while a component is being set up.
 */
export var ElementObserverSvelteUtils;
(function (ElementObserverSvelteUtils) {
    /**
     * Watches an element's size, borders and padding included.
     *
     * {@link ElementObserverUtils.observeBorderBoxSize} following a getter.
     *
     * @param getRef The element to watch. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns The current size, starting from an immediate measurement rather than waiting for the first
     * observer callback. Zeroes before the element exists.
     */
    ElementObserverSvelteUtils.createBorderBoxSizeObserver = (getRef, getIsDisabled) => {
        let size = $state.raw(NO_SIZE);
        $effect(() => {
            const ref = getRef();
            if (!ref || getIsDisabled?.())
                return;
            return untrack(() => ElementObserverUtils.observeBorderBoxSize(ref, (next) => {
                if (!Size2d.isSame(size, next))
                    size = next;
            }));
        });
        return () => size;
    };
    /**
     * Watches several elements' sizes at once.
     *
     * {@link ElementObserverUtils.observeBorderBoxSizes} following a getter.
     *
     * @param getRefs The elements to watch, in the order the sizes should come back. Missing entries are kept as
     * zeroes rather than dropped, so the result always lines up with the input.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns One size per element, and an empty list while disabled.
     */
    ElementObserverSvelteUtils.createBorderBoxSizeListObserver = (getRefs, getIsDisabled) => {
        let sizes = $state.raw(EMPTY_SIZES);
        const setSizes = (next) => {
            if (!isSameSizeList(sizes, next))
                sizes = next;
        };
        $effect(() => {
            const refs = getRefs();
            if (getIsDisabled?.()) {
                untrack(() => setSizes(EMPTY_SIZES));
                return;
            }
            return untrack(() => ElementObserverUtils.observeBorderBoxSizes(refs, setSizes));
        });
        return () => sizes;
    };
    /**
     * Watches just an element's height.
     *
     * @param getRef The element to watch.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns The current height. Changes only when the height does, so a width-only resize wakes nothing.
     */
    ElementObserverSvelteUtils.createBorderBoxHeightObserver = (getRef, getIsDisabled) => {
        const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(getRef, getIsDisabled);
        const height = $derived(getSize().height);
        return () => height;
    };
    /**
     * Watches whether an element is on screen.
     *
     * {@link ElementObserverUtils.observeViewportIntersection} following a getter.
     *
     * @param getRef The element to watch.
     * @param getIsDisabled Pass `true` to stop watching. Omitted means always on.
     * @returns Whether any part of the element is currently visible. `false` before the element exists, while
     * disabled, and until the observer first reports.
     */
    ElementObserverSvelteUtils.createViewportIntersectionObserver = (getRef, getIsDisabled) => {
        let isIntersecting = $state(false);
        $effect(() => {
            const ref = getRef();
            isIntersecting = false;
            if (!ref || getIsDisabled?.())
                return;
            return untrack(() => ElementObserverUtils.observeViewportIntersection(ref, (next) => {
                isIntersecting = next;
            }));
        });
        return () => isIntersecting;
    };
    /**
     * Keeps an element's position and size current every frame, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportRect} for as long as `getIsVisible` says so, with one measurement
     * taken whenever the element arrives or changes, whatever it says. The rectangle comes back in the enclosing
     * viewport's coordinates rather than the screen's, so it is correct inside a zoomed or panned viewport.
     *
     * @param getRef The element to measure.
     * @param getIsVisible Whether to keep measuring. The frame loop and the listeners both follow this.
     * @param opts.setElementRect Where to write the result. It is handed every measurement, a repeat included, so
     * it decides for itself what counts as a change.
     * @param opts.getPadding Grows the rectangle outwards, either evenly or edge by edge. Useful for a hover target
     * that should extend past what is drawn.
     * @param opts.getOffset Shifts the rectangle. Applied after the padding.
     */
    ElementObserverSvelteUtils.createViewportRectObserver = (getRef, getIsVisible, opts) => {
        const viewportContext = getViewportContext();
        $effect(() => {
            const ref = getRef();
            if (!ref)
                return;
            untrack(() => opts.setElementRect(ElementObserverUtils.measureViewportRect(ref, viewportContext, {
                padding: opts.getPadding?.(),
                offset: opts.getOffset?.(),
            })));
        });
        $effect(() => {
            if (!getIsVisible())
                return;
            return untrack(() => ElementObserverUtils.observeViewportRect(getRef, viewportContext, opts.setElementRect, opts));
        });
    };
    /**
     * Keeps several elements' positions and sizes current every frame, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportRects} for as long as `getIsVisible` says so, with one measurement
     * taken whenever the list changes, whatever it says.
     *
     * @param getRefs The elements to measure, in the order the rects should come back. A missing entry is kept as
     * `undefined` rather than dropped, so the result always lines up with the input.
     * @param getIsVisible Whether to keep measuring. The frame loop and the listeners both follow this.
     * @returns One rect per element, in the enclosing viewport's coordinates. `undefined` for an entry that has no
     * element.
     */
    ElementObserverSvelteUtils.createViewportRectListObserver = (getRefs, getIsVisible) => {
        const viewportContext = getViewportContext();
        let rects = $state.raw(EMPTY_RECTS);
        const setRects = (next) => {
            if (!isSameRectList(rects, next))
                rects = next;
        };
        $effect(() => {
            const refs = getRefs();
            untrack(() => setRects(ElementObserverUtils.measureViewportRects(refs, viewportContext)));
        });
        $effect(() => {
            if (!getIsVisible())
                return;
            return untrack(() => ElementObserverUtils.observeViewportRects(getRefs, viewportContext, setRects));
        });
        return () => rects;
    };
    /**
     * Follows which of a list of elements the reader has scrolled to, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeCurrentIndex} following getters.
     *
     * @param getRefs The elements to follow, in reading order. A missing entry is kept in place and never current.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @param opts.getOffsetRatio Where the line sits, as a share of the viewport's height from its top. Defaults to
     * `CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio`.
     * @returns The current element's index, or `undefined` while none has passed the line and while disabled.
     */
    ElementObserverSvelteUtils.createViewportCurrentIndexObserver = (getRefs, getIsDisabled, opts) => {
        const viewportContext = getViewportContext();
        let index = $state();
        $effect(() => {
            const refs = getRefs();
            const offsetRatio = opts?.getOffsetRatio?.() ?? CURRENT_INDEX_OBSERVER_DEFAULTS.offsetRatio;
            if (getIsDisabled?.()) {
                index = undefined;
                return;
            }
            return untrack(() => ElementObserverUtils.observeCurrentIndex(refs, viewportContext, (next) => {
                index = next;
            }, { offsetRatio }));
        });
        return () => index;
    };
    /**
     * Follows how far an element has traveled through the viewport as the page scrolls, in viewport coordinates.
     *
     * {@link ElementObserverUtils.observeViewportProgress} following getters. It is what drives anything that takes
     * `0`–`1` — a trail, an animation — from the page's scroll position.
     *
     * @param getRef The element to follow. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @returns `0` while the element has yet to come up from below the viewport, `1` once it has left through the
     * top, and the share in between while it crosses. `0` before the element exists and while disabled.
     */
    ElementObserverSvelteUtils.createViewportProgressObserver = (getRef, getIsDisabled) => {
        const viewportContext = getViewportContext();
        let progress = $state(0);
        $effect(() => {
            const ref = getRef();
            if (!ref || getIsDisabled?.()) {
                progress = 0;
                return;
            }
            return untrack(() => ElementObserverUtils.observeViewportProgress(ref, viewportContext, (next) => {
                progress = next;
            }));
        });
        return () => progress;
    };
    /**
     * Follows how far an element has traveled through a scrolling box as the box scrolls, in the box's coordinates.
     *
     * {@link ElementObserverUtils.observeScrollContainerProgress} following getters. It is what drives something
     * from the scroll of a panel, a list or a pane rather than of the page.
     *
     * @param getRef The element to follow. Nothing is measured until it exists.
     * @param getContainerRef The scrolling box it travels through. Nothing is measured until it exists.
     * @param getIsDisabled Pass `true` to stop following. Omitted means always on.
     * @returns `0` while the element has yet to come up from below the box's visible area, `1` once it has left
     * through the top, and the share in between while it crosses. `0` before either element exists and while
     * disabled.
     */
    ElementObserverSvelteUtils.createScrollContainerProgressObserver = (getRef, getContainerRef, getIsDisabled) => {
        const viewportContext = getViewportContext();
        let progress = $state(0);
        $effect(() => {
            const ref = getRef();
            if (!ref || getIsDisabled?.()) {
                progress = 0;
                return;
            }
            return untrack(() => ElementObserverUtils.observeScrollContainerProgress(ref, getContainerRef, viewportContext, (next) => {
                progress = next;
            }));
        });
        return () => progress;
    };
})(ElementObserverSvelteUtils || (ElementObserverSvelteUtils = {}));
