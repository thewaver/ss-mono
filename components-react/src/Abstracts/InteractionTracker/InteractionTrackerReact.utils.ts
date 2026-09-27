import { type RefObject, useEffect, useLayoutEffect, useMemo, useState } from "react";

import {
    type InteractionActivation,
    type InteractionDragEndReason,
    type InteractionDragRatio,
    type InteractionSwipeTracker,
    InteractionTrackerUtils,
} from "@thewaver/ss-components";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { useElement, useLatest, useStableList } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * Runs a pointer gesture's listeners while its element exists and it is enabled, and forgets a gesture under way when
 * the element changes, the gesture is disabled, or the component unmounts.
 */
const useGesture = (
    tracker: { observe: (element: HTMLElement) => () => void; reset: () => void },
    element: HTMLElement | undefined,
    isDisabled: boolean,
) => {
    useEffect(() => () => tracker.reset(), [tracker, element]);

    useEffect(() => {
        if (!element || isDisabled) {
            tracker.reset();

            return;
        }

        return tracker.observe(element);
    }, [tracker, element, isDisabled]);
};

/** Runs a swipe tracker: touch action always, gestures while enabled, the swallowed click always. */
const useSwipe = (
    tracker: InteractionSwipeTracker,
    ref: RefObject<HTMLElement | null>,
    isDisabled: boolean,
    axis: SwipeAxis | undefined,
) => {
    const element = useElement(ref);

    useLayoutEffect(() => {
        if (element) tracker.applyTouchAction(element, isDisabled);
    }, [tracker, element, isDisabled, axis]);

    useGesture(tracker, element, isDisabled);

    useEffect(() => (element ? tracker.observeClicks(element) : undefined), [tracker, element]);

    return useStore(tracker);
};

/**
 * The React side of `InteractionTrackerUtils`: each tracker following a ref, its state read as state, and its
 * listeners torn down on unmount. The rules themselves are framework-free.
 */
export namespace InteractionTrackerReactUtils {
    /**
     * Manages the tab order of an element's secondary controls.
     *
     * `InteractionTrackerUtils.wrapExtraControl` applied to each control, again whenever the list or the state
     * changes.
     *
     * @param elements The controls. Missing entries are skipped. A list with the same entries as last render counts
     * as unchanged.
     * @param isDisabled Whether the parent is disabled.
     * @param opts.isTabbable Pass `false` to take the controls out of the tab order while still enabled, for a
     * control reached through its parent rather than directly.
     */
    export const useExtraControls = (
        elements: Array<HTMLElement | undefined>,
        isDisabled: boolean,
        opts?: { isTabbable?: boolean },
    ) => {
        const stableElements = useStableList(elements);
        const isTabbable = opts?.isTabbable ?? true;

        useLayoutEffect(() => {
            const stops = stableElements.flatMap((element) =>
                element ? [InteractionTrackerUtils.wrapExtraControl(element, { isDisabled, isTabbable })] : [],
            );

            return () => {
                for (const stop of stops) stop();
            };
        }, [stableElements, isDisabled, isTabbable]);
    };

    /**
     * Tracks hover, focus and press on an element, and reports them as flags.
     *
     * `InteractionTrackerUtils.createElementTracker` following its arguments, read through
     * `InteractionTrackerUtils.computeFlags`. It also writes the element's tab order, and with
     * `applyButtonSemantics` its role, `aria-disabled` and cursor.
     *
     * @param ref The element to track.
     * @param isDisabled Whether the element is disabled.
     * @param opts.applyButtonSemantics Gives the element a button role, `aria-disabled` and a cursor.
     * @param opts.isReachable Whether a disabled element should still be focusable — the answer from
     * `InteractionTrackerUtils.computeIsReachable`.
     * @param opts.isTabbable Pass `false` to take the element out of the tab order while still enabled.
     * @returns `isHovered`, `isFocused`, `isFocusVisible` and `isActive`.
     */
    export const useElementFlags = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        opts?: { applyButtonSemantics?: boolean; isReachable?: boolean; isTabbable?: boolean },
    ) => {
        const element = useElement(ref);
        const [tracker] = useState(InteractionTrackerUtils.createElementTracker);
        const state = useStore(tracker);

        const isReachable = opts?.isReachable ?? false;
        const isTabbable = opts?.isTabbable ?? true;
        const applyButtonSemantics = opts?.applyButtonSemantics;

        useLayoutEffect(
            () =>
                element
                    ? tracker.observe(element, { isDisabled, isReachable, isTabbable, applyButtonSemantics })
                    : undefined,
            [tracker, element, isDisabled, isReachable, isTabbable, applyButtonSemantics],
        );

        return useMemo(() => InteractionTrackerUtils.computeFlags(state, isDisabled), [state, isDisabled]);
    };

    /**
     * Whether the tab is currently in the background.
     *
     * @returns Whether the page is hidden.
     */
    export const usePageHidden = () => {
        const [watcher] = useState(InteractionTrackerUtils.createPageHiddenWatcher);

        useEffect(() => watcher.observe(), [watcher]);

        return useStore(watcher);
    };

    /**
     * Whether something should be held open rather than allowed to close on its own.
     *
     * The pointer is over it, focus is inside it, or the tab is in the background so the user is not there to see
     * it at all. An auto-dismissing toast or a carousel checks this before moving on.
     *
     * @param ref The element to watch.
     * @returns Whether to hold.
     */
    export const useHold = (ref: RefObject<HTMLElement | null>) => {
        const element = useElement(ref);
        const [tracker] = useState(InteractionTrackerUtils.createHoldTracker);
        const isInside = useStore(tracker, (state) => state.isHovered || state.hasFocusWithin);
        const isPageHidden = usePageHidden();

        useEffect(() => (element ? tracker.observe(element) : undefined), [tracker, element]);

        return isInside || isPageHidden;
    };

    /**
     * Reports each press of an element, by pointer or by keyboard.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore presses.
     * @param onActivate Called on each press, with the press position as a `0` to `1` ratio across the element —
     * the center for a keyboard press — and a count that increases each time. This render's is always the one
     * called.
     */
    export const useActivation = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        onActivate: (activation: InteractionActivation) => void,
    ) => {
        const element = useElement(ref);
        const latest = useLatest(onActivate);
        const [tracker] = useState(() =>
            InteractionTrackerUtils.createActivationTracker((activation) => latest.current(activation)),
        );

        useEffect(
            () => (element && !isDisabled ? tracker.observe(element) : undefined),
            [tracker, element, isDisabled],
        );
    };

    /**
     * Reports the pointer's position within an element throughout a drag.
     *
     * A drag under way survives a re-render and is dropped, without `onDragEnd`, when the element changes or the
     * control is disabled.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore drags.
     * @param opts.onDrag Called on press and on every move, with the position as a `0` to `1` ratio across the
     * element, held inside it however far the pointer strays.
     * @param opts.onDragEnd Called when the drag finishes, saying whether the pointer was released or the gesture
     * was canceled by the system.
     * @returns `isDragging`.
     */
    export const useDrag = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        opts: { onDrag: (ratio: InteractionDragRatio) => void; onDragEnd?: (reason: InteractionDragEndReason) => void },
    ) => {
        const element = useElement(ref);
        const latest = useLatest(opts);
        const [tracker] = useState(() =>
            InteractionTrackerUtils.createDragTracker({
                onDrag: (ratio) => latest.current.onDrag(ratio),
                onDragEnd: (reason) => latest.current.onDragEnd?.(reason),
            }),
        );

        useGesture(tracker, element, isDisabled);

        return { isDragging: useStore(tracker) };
    };

    /**
     * Tracks a swipe along one axis across an element, and reports which way it committed.
     *
     * `InteractionTrackerUtils.createAxialSwipeTracker`: the other axis is left to the browser to scroll.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore swipes.
     * @param opts.axis Which way the swipe runs.
     * @param opts.commitRatio How far across the element the swipe must travel to count, as a fraction.
     * @param opts.onSwipe Called on every move once the gesture is owned, with progress as a signed fraction of the
     * element.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined` when it
     * fell short or the system canceled it.
     * @returns `isSwiping`.
     */
    export const useAxialSwipe = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        opts: {
            axis: SwipeAxis;
            commitRatio: number;
            onSwipe: (progressRatio: number) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => {
        const latest = useLatest(opts);
        const [tracker] = useState(() =>
            InteractionTrackerUtils.createAxialSwipeTracker({
                getAxis: () => latest.current.axis,
                getCommitRatio: () => latest.current.commitRatio,
                onSwipe: (progress) => latest.current.onSwipe(progress),
                onSwipeEnd: (direction) => latest.current.onSwipeEnd(direction),
            }),
        );

        return { isSwiping: useSwipe(tracker, ref, isDisabled, opts.axis) };
    };

    /**
     * Tracks a swipe free to go any of the four ways, and reports which one it committed to.
     *
     * `InteractionTrackerUtils.createFreeSwipeTracker`: both axes are claimed, so the browser is left none to
     * scroll on a touch screen.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore swipes.
     * @param opts.commitRatio How far across the element the swipe must travel to count, as a fraction.
     * @param opts.onSwipe Called on every move once the gesture is owned, with signed travel on each axis.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined`.
     * @returns `isSwiping`.
     */
    export const useFreeSwipe = (
        ref: RefObject<HTMLElement | null>,
        isDisabled: boolean,
        opts: {
            commitRatio: number;
            onSwipe: (progress: InteractionDragRatio) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => {
        const latest = useLatest(opts);
        const [tracker] = useState(() =>
            InteractionTrackerUtils.createFreeSwipeTracker({
                getCommitRatio: () => latest.current.commitRatio,
                onSwipe: (progress) => latest.current.onSwipe(progress),
                onSwipeEnd: (direction) => latest.current.onSwipeEnd(direction),
            }),
        );

        return { isSwiping: useSwipe(tracker, ref, isDisabled, undefined) };
    };
}
