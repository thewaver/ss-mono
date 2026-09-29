import { type MaybeRefOrGetter, computed, onScopeDispose, toValue } from "vue";

import {
    type InteractionActivation,
    type InteractionDragEndReason,
    type InteractionDragRatio,
    type InteractionSwipeTracker,
    InteractionTrackerUtils,
} from "@thewaver/ss-components";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStableList } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/**
 * Runs a pointer gesture's listeners while its element exists and it is enabled, and forgets a gesture under way when
 * the element changes, the gesture is disabled, or the component unmounts.
 */
const useGesture = (
    tracker: { observe: (element: HTMLElement) => () => void; reset: () => void },
    ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
    isDisabled: MaybeRefOrGetter<boolean>,
) => {
    watchAfterRender([() => toValue(ref)], () => () => tracker.reset());

    watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) => {
        if (!element || isOff) {
            tracker.reset();

            return;
        }

        return tracker.observe(element);
    });
};

/** Runs a swipe tracker: touch action always, gestures while enabled, the swallowed click always. */
const useSwipe = (
    tracker: InteractionSwipeTracker,
    ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
    isDisabled: MaybeRefOrGetter<boolean>,
    axis: MaybeRefOrGetter<SwipeAxis | undefined>,
) => {
    watchAfterRender(
        [() => toValue(ref), () => toValue(isDisabled), () => toValue(axis)],
        ([element, isOff]) => {
            if (element) tracker.applyTouchAction(element, isOff);
        },
    );

    useGesture(tracker, ref, isDisabled);

    watchAfterRender([() => toValue(ref)], ([element]) => (element ? tracker.observeClicks(element) : undefined));

    return useStore(tracker);
};

/**
 * The Vue side of `InteractionTrackerUtils`: each tracker following an element, its state read as refs, and its
 * listeners torn down on unmount. The rules themselves are framework-free.
 */
export namespace InteractionTrackerVueUtils {
    /**
     * Manages the tab order of an element's secondary controls.
     *
     * `InteractionTrackerUtils.wrapExtraControl` applied to each control once the component has rendered, and again
     * whenever the list or the state changes.
     *
     * Must run inside a component's `setup`.
     *
     * @param elements The controls. Missing entries are skipped. A list with the same entries as the last one counts
     * as unchanged.
     * @param isDisabled Whether the parent is disabled.
     * @param opts.isTabbable Pass `false` to take the controls out of the tab order while still enabled, for a
     * control reached through its parent rather than directly.
     */
    export const useExtraControls = (
        elements: MaybeRefOrGetter<Array<HTMLElement | null | undefined>>,
        isDisabled: MaybeRefOrGetter<boolean>,
        opts?: { isTabbable?: MaybeRefOrGetter<boolean | undefined> },
    ) => {
        const stableElements = useStableList(() => toValue(elements));

        watchAfterRender(
            [stableElements, () => toValue(isDisabled), () => toValue(opts?.isTabbable) ?? true],
            ([list, isOff, isTabbable]) => {
                const stops = list.flatMap((element) =>
                    element
                        ? [InteractionTrackerUtils.wrapExtraControl(element, { isDisabled: isOff, isTabbable })]
                        : [],
                );

                return () => {
                    for (const stop of stops) stop();
                };
            },
        );
    };

    /**
     * Tracks hover, focus and press on an element, and reports them as flags.
     *
     * `InteractionTrackerUtils.createElementTracker` following its arguments, read through
     * `InteractionTrackerUtils.computeFlags`. It also writes the element's tab order, and with
     * `applyButtonSemantics` its role, `aria-disabled` and cursor.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Whether the element is disabled.
     * @param opts.applyButtonSemantics Gives the element a button role, `aria-disabled` and a cursor.
     * @param opts.isReachable Whether a disabled element should still be focusable — the answer from
     * `InteractionTrackerUtils.computeIsReachable`.
     * @param opts.isTabbable Pass `false` to take the element out of the tab order while still enabled.
     * @returns A computed ref of `isHovered`, `isFocused`, `isFocusVisible` and `isActive`.
     */
    export const useElementFlags = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        opts?: {
            applyButtonSemantics?: MaybeRefOrGetter<boolean | undefined>;
            isReachable?: MaybeRefOrGetter<boolean | undefined>;
            isTabbable?: MaybeRefOrGetter<boolean | undefined>;
        },
    ) => {
        const tracker = InteractionTrackerUtils.createElementTracker();
        const state = useStore(tracker);

        watchAfterRender(
            [
                () => toValue(ref),
                () => toValue(isDisabled),
                () => toValue(opts?.isReachable) ?? false,
                () => toValue(opts?.isTabbable) ?? true,
                () => toValue(opts?.applyButtonSemantics),
            ],
            ([element, isOff, isReachable, isTabbable, applyButtonSemantics]) =>
                element
                    ? tracker.observe(element, { isDisabled: isOff, isReachable, isTabbable, applyButtonSemantics })
                    : undefined,
        );

        return computed(() => InteractionTrackerUtils.computeFlags(state.value, toValue(isDisabled)));
    };

    /**
     * Whether the tab is currently in the background.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @returns A ref of whether the page is hidden.
     */
    export const usePageHidden = () => {
        const watcher = InteractionTrackerUtils.createPageHiddenWatcher();

        onScopeDispose(watcher.observe());

        return useStore(watcher);
    };

    /**
     * Whether something should be held open rather than allowed to close on its own.
     *
     * The pointer is over it, focus is inside it, or the tab is in the background so the user is not there to see
     * it at all. An auto-dismissing toast or a carousel checks this before moving on.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to watch.
     * @returns A computed ref of whether to hold.
     */
    export const useHold = (ref: MaybeRefOrGetter<HTMLElement | null | undefined>) => {
        const tracker = InteractionTrackerUtils.createHoldTracker();
        const isInside = useStore(tracker, (state) => state.isHovered || state.hasFocusWithin);
        const isPageHidden = usePageHidden();

        watchAfterRender([() => toValue(ref)], ([element]) => (element ? tracker.observe(element) : undefined));

        return computed(() => isInside.value || isPageHidden.value);
    };

    /**
     * Reports each press of an element, by pointer or by keyboard.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore presses.
     * @param onActivate Called on each press, with the press position as a `0` to `1` ratio across the element —
     * the center for a keyboard press — and a count that increases each time. Wrap a callback prop in an arrow that
     * reads it, so the current one is the one called.
     */
    export const useActivation = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        onActivate: (activation: InteractionActivation) => void,
    ) => {
        const tracker = InteractionTrackerUtils.createActivationTracker(onActivate);

        watchAfterRender([() => toValue(ref), () => toValue(isDisabled)], ([element, isOff]) =>
            element && !isOff ? tracker.observe(element) : undefined,
        );
    };

    /**
     * Reports the pointer's position within an element throughout a drag.
     *
     * A drag under way survives a re-render and is dropped, without `onDragEnd`, when the element changes or the
     * control is disabled.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore drags.
     * @param opts.onDrag Called on press and on every move, with the position as a `0` to `1` ratio across the
     * element, held inside it however far the pointer strays.
     * @param opts.onDragEnd Called when the drag finishes, saying whether the pointer was released or the gesture
     * was canceled by the system.
     * @returns `isDragging`, as a ref.
     */
    export const useDrag = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        opts: { onDrag: (ratio: InteractionDragRatio) => void; onDragEnd?: (reason: InteractionDragEndReason) => void },
    ) => {
        const tracker = InteractionTrackerUtils.createDragTracker({
            onDrag: (ratio) => opts.onDrag(ratio),
            onDragEnd: (reason) => opts.onDragEnd?.(reason),
        });

        useGesture(tracker, ref, isDisabled);

        return { isDragging: useStore(tracker) };
    };

    /**
     * Tracks a swipe along one axis across an element, and reports which way it committed.
     *
     * `InteractionTrackerUtils.createAxialSwipeTracker`: the other axis is left to the browser to scroll.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore swipes.
     * @param opts.axis Which way the swipe runs.
     * @param opts.commitRatio How far across the element the swipe must travel to count, as a fraction.
     * @param opts.onSwipe Called on every move once the gesture is owned, with progress as a signed fraction of the
     * element.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined` when it
     * fell short or the system canceled it.
     * @returns `isSwiping`, as a ref.
     */
    export const useAxialSwipe = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        opts: {
            axis: MaybeRefOrGetter<SwipeAxis>;
            commitRatio: MaybeRefOrGetter<number>;
            onSwipe: (progressRatio: number) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => {
        const tracker = InteractionTrackerUtils.createAxialSwipeTracker({
            getAxis: () => toValue(opts.axis),
            getCommitRatio: () => toValue(opts.commitRatio),
            onSwipe: (progress) => opts.onSwipe(progress),
            onSwipeEnd: (direction) => opts.onSwipeEnd(direction),
        });

        return { isSwiping: useSwipe(tracker, ref, isDisabled, opts.axis) };
    };

    /**
     * Tracks a swipe free to go any of the four ways, and reports which one it committed to.
     *
     * `InteractionTrackerUtils.createFreeSwipeTracker`: both axes are claimed, so the browser is left none to
     * scroll on a touch screen.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element to track.
     * @param isDisabled Whether to ignore swipes.
     * @param opts.commitRatio How far across the element the swipe must travel to count, as a fraction.
     * @param opts.onSwipe Called on every move once the gesture is owned, with signed travel on each axis.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined`.
     * @returns `isSwiping`, as a ref.
     */
    export const useFreeSwipe = (
        ref: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isDisabled: MaybeRefOrGetter<boolean>,
        opts: {
            commitRatio: MaybeRefOrGetter<number>;
            onSwipe: (progress: InteractionDragRatio) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => {
        const tracker = InteractionTrackerUtils.createFreeSwipeTracker({
            getCommitRatio: () => toValue(opts.commitRatio),
            onSwipe: (progress) => opts.onSwipe(progress),
            onSwipeEnd: (direction) => opts.onSwipeEnd(direction),
        });

        return { isSwiping: useSwipe(tracker, ref, isDisabled, undefined) };
    };
}
