import { untrack } from "svelte";

import {
    type InteractionActivation,
    type InteractionDragEndReason,
    type InteractionDragRatio,
    type InteractionSwipeTracker,
    InteractionTrackerUtils,
} from "@thewaver/ss-components";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { watchChange } from "../../Utils/effectUtils.svelte.js";
import { readStore } from "../../Utils/storeUtils.js";

const followGesture = (
    tracker: { observe: (element: HTMLElement) => () => void; reset: () => void },
    getRef: () => HTMLElement | undefined,
    getIsDisabled: () => boolean,
) => {
    watchChange(getRef, () => tracker.reset());

    $effect(() => {
        const ref = getRef();

        if (!ref || getIsDisabled()) {
            untrack(() => tracker.reset());

            return;
        }

        return untrack(() => tracker.observe(ref));
    });

    $effect(() => () => tracker.reset());
};

const followSwipe = (
    tracker: InteractionSwipeTracker,
    getRef: () => HTMLElement | undefined,
    getIsDisabled: () => boolean,
    getAxis?: () => SwipeAxis,
) => {
    $effect(() => {
        const ref = getRef();
        const isDisabled = getIsDisabled();

        getAxis?.();

        if (!ref) return;

        untrack(() => tracker.applyTouchAction(ref, isDisabled));
    });

    followGesture(tracker, getRef, getIsDisabled);

    $effect(() => {
        const ref = getRef();

        if (!ref) return;

        return untrack(() => tracker.observeClicks(ref));
    });

    return readStore(tracker);
};

/**
 * The Svelte side of {@link InteractionTrackerUtils}: each tracker following element getters, its state read as
 * getters, and its listeners torn down with the component. The rules themselves are framework-free.
 *
 * Every function here must run while a component is being set up.
 */
export namespace InteractionTrackerSvelteUtils {
    /**
     * Manages the tab order of an element's secondary controls.
     *
     * {@link InteractionTrackerUtils.wrapExtraControl} applied to each control, again whenever the list or the state
     * changes.
     *
     * @param getRefs The controls. Missing entries are skipped, so elements that have not arrived yet are fine.
     * @param getIsDisabled Whether the parent is disabled.
     * @param opts.getIsTabbable Pass `false` to take the controls out of the tab order while still enabled, for a
     * control reached through its parent rather than directly.
     */
    export const wrapExtraControls = (
        getRefs: () => Array<HTMLElement | undefined>,
        getIsDisabled: () => boolean,
        opts?: { getIsTabbable?: () => boolean },
    ) => {
        $effect(() => {
            const refs = getRefs();
            const isDisabled = getIsDisabled();
            const isTabbable = opts?.getIsTabbable?.() ?? true;

            const stops = untrack(() =>
                refs.flatMap((ref) =>
                    ref ? [InteractionTrackerUtils.wrapExtraControl(ref, { isDisabled, isTabbable })] : [],
                ),
            );

            return () => {
                for (const stop of stops) stop();
            };
        });
    };

    /**
     * Tracks hover, focus and press on an element, and reports them as flags.
     *
     * {@link InteractionTrackerUtils.createElementTracker} following getters, read through
     * {@link InteractionTrackerUtils.computeFlags}. It also writes the element's tab order, and with
     * `applyButtonSemantics` its role, `aria-disabled` and cursor.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether the element is disabled.
     * @param opts.applyButtonSemantics Gives the element a button role, `aria-disabled` and a cursor. Uses
     * `aria-disabled` rather than the `disabled` attribute so the element stays focusable and can still explain
     * itself.
     * @param opts.getIsReachable Whether a disabled element should still be focusable — the answer from
     * {@link InteractionTrackerUtils.computeIsReachable}.
     * @param opts.getIsTabbable Pass `false` to take the element out of the tab order while still enabled.
     * @returns `getFlags`, giving `isHovered`, `isFocused`, `isFocusVisible` and `isActive`.
     */
    export const wrapElement = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        opts?: {
            applyButtonSemantics?: boolean;
            getIsReachable?: () => boolean;
            getIsTabbable?: () => boolean;
        },
    ) => {
        const tracker = InteractionTrackerUtils.createElementTracker();
        const getState = readStore(tracker);

        const flags = $derived(InteractionTrackerUtils.computeFlags(getState(), getIsDisabled()));

        $effect(() => {
            const ref = getRef();
            const isDisabled = getIsDisabled();
            const isReachable = opts?.getIsReachable?.() ?? false;
            const isTabbable = opts?.getIsTabbable?.() ?? true;

            if (!ref) return;

            return untrack(() =>
                tracker.observe(ref, {
                    isDisabled,
                    isReachable,
                    isTabbable,
                    applyButtonSemantics: opts?.applyButtonSemantics,
                }),
            );
        });

        return { getFlags: () => flags };
    };

    /**
     * Whether the tab is currently in the background.
     *
     * {@link InteractionTrackerUtils.createPageHiddenWatcher} as a getter.
     *
     * @returns Whether the page is hidden.
     */
    export const trackPageHidden = () => {
        const watcher = InteractionTrackerUtils.createPageHiddenWatcher();

        $effect(() => untrack(() => watcher.observe()));

        return readStore(watcher);
    };

    /**
     * Whether something should be held open rather than allowed to close on its own.
     *
     * Three reasons to hold, and they are all the same reason from the user's point of view — they are still using
     * it. The pointer is over it, focus is inside it, or the tab is in the background so they are not there to see it
     * at all. An auto-dismissing toast or a carousel checks this before moving on.
     *
     * @param getRef The element to watch.
     * @returns Whether to hold.
     */
    export const trackHold = (getRef: () => HTMLElement | undefined) => {
        const tracker = InteractionTrackerUtils.createHoldTracker();
        const getIsInside = readStore(tracker, (state) => state.isHovered || state.hasFocusWithin);
        const getIsPageHidden = trackPageHidden();

        $effect(() => {
            const ref = getRef();

            if (!ref) return;

            return untrack(() => tracker.observe(ref));
        });

        const isHeld = $derived(getIsInside() || getIsPageHidden());

        return () => isHeld;
    };

    /**
     * Reports each press of an element, by pointer or by keyboard.
     *
     * {@link InteractionTrackerUtils.createActivationTracker} following getters.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore presses.
     * @param onActivate Called on each press, with the press position as a `0` to `1` ratio across the element — the
     * center for a keyboard press — and a count that increases each time.
     */
    export const trackActivation = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        onActivate: (activation: InteractionActivation) => void,
    ) => {
        const tracker = InteractionTrackerUtils.createActivationTracker(onActivate);

        $effect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled()) return;

            return untrack(() => tracker.observe(ref));
        });
    };

    /**
     * Reports the pointer's position within an element throughout a drag.
     *
     * {@link InteractionTrackerUtils.createDragTracker} following getters. A drag under way is dropped, without
     * `onDragEnd`, when the element changes, the control is disabled or the component is destroyed — but not when its
     * listeners are merely attached again.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore drags.
     * @param opts.onDrag Called on press and on every move, with the position as a `0` to `1` ratio across the
     * element, held inside it however far the pointer strays.
     * @param opts.onDragEnd Called when the drag finishes, saying whether the pointer was released or the gesture was
     * canceled by the system.
     * @returns `getIsDragging`.
     */
    export const trackDrag = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        opts: {
            onDrag: (ratio: InteractionDragRatio) => void;
            onDragEnd?: (reason: InteractionDragEndReason) => void;
        },
    ) => {
        const tracker = InteractionTrackerUtils.createDragTracker(opts);

        followGesture(tracker, getRef, getIsDisabled);

        return { getIsDragging: readStore(tracker) };
    };

    /**
     * Tracks a swipe along one axis across an element, and reports which way it committed.
     *
     * {@link InteractionTrackerUtils.createAxialSwipeTracker} following getters: the other axis is left to the
     * browser to scroll. Use {@link trackFreeSwipe} where all four directions are wanted.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore swipes.
     * @param opts.getAxis Which way the swipe runs.
     * @param opts.getCommitRatio How far across the element the swipe must travel to count, as a fraction. Short of
     * it, the swipe ends without a direction and the caller should spring back.
     * @param opts.onSwipe Called on every move once the gesture is owned, with progress as a signed fraction of the
     * element — negative back along the axis, positive forward.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined` when it
     * fell short or the system canceled it.
     * @returns `getIsSwiping`.
     */
    export const trackAxialSwipe = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        opts: {
            getAxis: () => SwipeAxis;
            getCommitRatio: () => number;
            onSwipe: (progressRatio: number) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => ({
        getIsSwiping: followSwipe(
            InteractionTrackerUtils.createAxialSwipeTracker(opts),
            getRef,
            getIsDisabled,
            opts.getAxis,
        ),
    });

    /**
     * Tracks a swipe free to go any of the four ways, and reports which one it committed to.
     *
     * {@link InteractionTrackerUtils.createFreeSwipeTracker} following getters: both axes are claimed, so the
     * browser is left none to scroll on a touch screen.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore swipes.
     * @param opts.getCommitRatio How far across the element the swipe must travel to count, as a fraction. Short of
     * it, the swipe ends without a direction and the caller should spring back.
     * @param opts.onSwipe Called on every move once the gesture is owned, with signed travel on each axis as a
     * fraction of the element's own width and height.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or `undefined` when it
     * fell short or the system canceled it.
     * @returns `getIsSwiping`.
     */
    export const trackFreeSwipe = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        opts: {
            getCommitRatio: () => number;
            onSwipe: (progress: InteractionDragRatio) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => ({
        getIsSwiping: followSwipe(InteractionTrackerUtils.createFreeSwipeTracker(opts), getRef, getIsDisabled),
    });
}
