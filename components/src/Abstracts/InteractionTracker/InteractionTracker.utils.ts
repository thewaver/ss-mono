import { GestureUtils, MathUtils, StoreUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { NavigatorUtils } from "../Navigator/Navigator.utils";
import type {
    InteractionActivation,
    InteractionActivationTracker,
    InteractionDragEndReason,
    InteractionDragRatio,
    InteractionDragTracker,
    InteractionElementOpts,
    InteractionElementState,
    InteractionElementTracker,
    InteractionHoldState,
    InteractionHoldTracker,
    InteractionPageHiddenWatcher,
    InteractionSwipeTracker,
    InternalInteractionFlags,
} from "./InteractionTracker.types";

/** How far a swipe must travel, as a fraction of the element, before it takes over from a scroll or a click. */
const SWIPE_SLOP_RATIO = 0.02;
/** Where a keyboard activation is reported as having happened, there being no pointer to ask. */
const CENTER_RATIO: InteractionDragRatio = { x: 0.5, y: 0.5 };
/** Slack allowed when deciding whether a scroller is at its end, since scroll positions are fractional on high-density screens. */
const SCROLL_EDGE_PX = 1;
/** Lets the browser decide whether focus should be shown, rather than guessing from the input device. */
const FOCUS_VISIBLE_SELECTOR = ":focus-visible";
/** What the browser is still allowed to scroll while a swipe is being tracked: the axis the swipe does not use. */
const SWIPE_TOUCH_ACTIONS: Record<SwipeAxis, string> = {
    horizontal: "pan-y",
    vertical: "pan-x",
};
/** A swipe free to go any of the four ways leaves the browser no axis to scroll, since it claims both. */
const FREE_SWIPE_TOUCH_ACTION = "none";
/** Where a swipe stands before the pointer has moved, and what it is put back to once one ends. */
const NO_SWIPE_PROGRESS: InteractionDragRatio = { x: 0, y: 0 };

/** Picks one axis out of a pair of travels, so the two swipe trackers agree on which field is which axis. */
const getAxisTravel = (travel: InteractionDragRatio, axis: SwipeAxis) => (axis === "horizontal" ? travel.x : travel.y);

/** Whether focus left an element's subtree entirely, rather than moving within it. */
const getHasLeft = (event: FocusEvent) => {
    const target = event.relatedTarget;

    return !(target instanceof Node) || !(event.currentTarget as HTMLElement).contains(target);
};

/** Where a pointer sits within a rectangle, as `0` to `1` on each axis. Values outside that range mean the pointer is outside the rectangle. */
const computeRatio = (rect: DOMRect, clientX: number, clientY: number): InteractionDragRatio => {
    return {
        x: MathUtils.normalize(clientX, rect.left, rect.right),
        y: MathUtils.normalize(clientY, rect.top, rect.bottom),
    };
};

/** Whether an element can still scroll further in the direction of a drag. */
const getHasScrollRoom = (element: Element, axis: SwipeAxis, delta: number) => {
    const position = axis === "horizontal" ? element.scrollLeft : element.scrollTop;
    const extent =
        axis === "horizontal" ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight;

    return delta > 0 ? position > SCROLL_EDGE_PX : position < extent - SCROLL_EDGE_PX;
};

/**
 * Whether anything between the event's target and the tracked element can still scroll.
 *
 * This is what decides a conflict between a swipe and a scroll. If some ancestor scroller has room
 * left, the gesture belongs to it; only once they have all reached their ends does the swipe take
 * over.
 */
const getHasScrollChainRoom = (target: EventTarget | null, root: HTMLElement, axis: SwipeAxis, delta: number) => {
    let node = target instanceof Element ? target : null;

    while (node) {
        if (getHasScrollRoom(node, axis, delta)) return true;
        if (node === root) return false;

        node = node.parentElement;
    }

    return false;
};

/** Holds a ratio inside the element, so a pointer dragged past the edge reads as being at the edge. */
const clampRatio = (ratio: InteractionDragRatio): InteractionDragRatio => ({
    x: MathUtils.clamp01(ratio.x),
    y: MathUtils.clamp01(ratio.y),
});

/** Nothing hovered, focused or pressed, and no flag written yet. */
const IDLE_ELEMENT_STATE: InteractionElementState = { isActiveByMouse: false, isActiveByKey: false };

/** Neither hovered nor holding focus. */
const IDLE_HOLD_STATE: InteractionHoldState = { isHovered: false, hasFocusWithin: false };

/** Stops a press from focusing a control that must not take focus. */
const preventFocusOnPress = (e: MouseEvent) => {
    e.preventDefault();
};

/**
 * The shared pointer-drag machinery behind dragging and swiping.
 *
 * Two things it settles for both. A gesture is not owned the moment the pointer goes down — the
 * caller decides when to engage, which is what lets a swipe wait to see whether the movement is
 * really a swipe. And once engaged, the pointer is captured, so the gesture survives the pointer
 * leaving the element or the window.
 *
 * Stopping only removes the listeners, so a gesture under way survives them being attached again; `reset` is
 * what forgets it and reports it disengaged, without calling `onEnd`.
 *
 * @param opts.isMeasuredFromStart Measures ratios against the element's rectangle as it was when the
 * gesture began rather than as it is now, for a gesture that moves the element it is being tracked
 * on.
 * @param opts.onDown Called on press, with a chance to engage immediately.
 * @param opts.onMove Called on every move, engaged or not, with a chance to engage.
 * @param opts.onEnd Called only if the gesture was engaged.
 * @returns A store of whether the gesture is owned, `observe` to track an element until stopped, and `reset`.
 */
const createPointerGesture = (opts: {
    isMeasuredFromStart?: boolean;
    onDown: (ratio: InteractionDragRatio, engage: () => void) => void;
    onMove: (ratio: InteractionDragRatio, engage: () => void) => void;
    onEnd: (reason: InteractionDragEndReason) => void;
}) => {
    const engaged = StoreUtils.create(false);

    let pointerId: number | undefined;
    let startRect: DOMRect | undefined;

    const observe = (element: HTMLElement) => {
        const measure = () => (opts.isMeasuredFromStart && startRect ? startRect : element.getBoundingClientRect());

        const engage = () => {
            if (pointerId === undefined) return;

            element.setPointerCapture(pointerId);
            engaged.set(true);
        };

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            if (pointerId !== undefined) return;

            pointerId = e.pointerId;
            startRect = element.getBoundingClientRect();

            opts.onDown(computeRatio(startRect, e.clientX, e.clientY), engage);

            if (engaged.get()) e.preventDefault();
        };

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;

            opts.onMove(computeRatio(measure(), e.clientX, e.clientY), engage);

            if (engaged.get()) e.preventDefault();
        };

        const onPointerEnd = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;

            const wasEngaged = engaged.get();

            if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);

            pointerId = undefined;
            startRect = undefined;

            engaged.set(false);

            if (wasEngaged) opts.onEnd(e.type === "pointercancel" ? "cancel" : "release");
        };

        element.addEventListener("pointerdown", onPointerDown);
        element.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerEnd);
        document.addEventListener("pointercancel", onPointerEnd);

        return () => {
            element.removeEventListener("pointerdown", onPointerDown);
            element.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerEnd);
            document.removeEventListener("pointercancel", onPointerEnd);
        };
    };

    const reset = () => {
        pointerId = undefined;
        startRect = undefined;

        engaged.set(false);
    };

    return { engaged, observe, reset };
};

/**
 * The whole of a swipe, with the number of live axes left open.
 *
 * Both public swipe trackers are this function with `getAxis` answered differently, because everything a
 * swipe competes with — the deferred ownership, the `touch-action` handed to the browser, the ancestor
 * scroller that has to be asked whether it still has room, the click swallowed afterwards — is the same
 * work whether one axis is live or both. Only three things read the axis: which travel the slop threshold
 * is measured against, which `touch-action` is written, and how the committed direction is decided.
 *
 * An `undefined` axis means free: both axes are measured, and the one traveled furthest is the one that
 * commits.
 *
 * @param opts.getAxis Which axis is live, or `undefined` for both.
 * @param opts.getCommitRatio How far the swipe must travel to count, as a fraction of the element.
 * @param opts.onSwipe Called on every move once the gesture is owned, with signed travel on both axes.
 * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction or `undefined`.
 * @returns The tracker.
 */
const createSwipeGesture = (opts: {
    getAxis: () => SwipeAxis | undefined;
    getCommitRatio: () => number;
    onSwipe: (progress: InteractionDragRatio) => void;
    onSwipeEnd: (direction: SwipeDirection | undefined) => void;
}): InteractionSwipeTracker => {
    let origin: InteractionDragRatio | undefined;
    let progress = NO_SWIPE_PROGRESS;
    let hasPendingClick = false;

    const computeProgress = (start: InteractionDragRatio, ratio: InteractionDragRatio) => ({
        x: GestureUtils.computeSwipeProgress(start, ratio, "horizontal"),
        y: GestureUtils.computeSwipeProgress(start, ratio, "vertical"),
    });

    const getLiveTravel = (value: InteractionDragRatio) => {
        const axis = opts.getAxis();

        if (axis === undefined) return Math.max(Math.abs(value.x), Math.abs(value.y));

        return Math.abs(getAxisTravel(value, axis));
    };

    const computeDirection = (value: InteractionDragRatio) => {
        const axis = opts.getAxis();

        if (axis === undefined) return GestureUtils.computeFreeSwipeDirection(value, opts.getCommitRatio());

        return GestureUtils.computeSwipeDirection(getAxisTravel(value, axis), axis, opts.getCommitRatio());
    };

    const pointer = createPointerGesture({
        isMeasuredFromStart: true,
        onDown: (ratio) => {
            origin = ratio;
            progress = NO_SWIPE_PROGRESS;
            hasPendingClick = false;
        },
        onMove: (ratio, engage) => {
            if (!origin) return;

            progress = computeProgress(origin, ratio);

            if (!pointer.engaged.get()) {
                if (getLiveTravel(progress) < SWIPE_SLOP_RATIO) return;

                engage();
            }

            opts.onSwipe(progress);
        },
        onEnd: (reason) => {
            const direction = reason === "cancel" ? undefined : computeDirection(progress);

            origin = undefined;
            progress = NO_SWIPE_PROGRESS;
            hasPendingClick = true;

            opts.onSwipeEnd(direction);
        },
    });

    const observeTouches = (element: HTMLElement) => {
        let startTouch: { clientX: number; clientY: number } | undefined;
        let isOwned: boolean | undefined;

        const onTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];

            startTouch = touch && { clientX: touch.clientX, clientY: touch.clientY };
            isOwned = undefined;
        };

        const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];

            if (isOwned === undefined) {
                if (!startTouch || !touch) return;

                const travel = { x: touch.clientX - startTouch.clientX, y: touch.clientY - startTouch.clientY };
                const axis = opts.getAxis() ?? GestureUtils.computeTravelAxis(travel);
                const delta = getAxisTravel(travel, axis);

                if (delta === 0) return;

                isOwned = !getHasScrollChainRoom(e.target, element, axis, delta);
            }

            if (isOwned && e.cancelable) e.preventDefault();
        };

        const onTouchEnd = () => {
            startTouch = undefined;
            isOwned = undefined;
        };

        element.addEventListener("touchstart", onTouchStart, { passive: true });
        element.addEventListener("touchmove", onTouchMove, { passive: false });
        element.addEventListener("touchend", onTouchEnd, { passive: true });
        element.addEventListener("touchcancel", onTouchEnd, { passive: true });

        return () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
            element.removeEventListener("touchcancel", onTouchEnd);
        };
    };

    return {
        get: pointer.engaged.get,
        subscribe: pointer.engaged.subscribe,
        observe: (element) => {
            const stopPointer = pointer.observe(element);
            const stopTouches = observeTouches(element);

            return () => {
                stopPointer();
                stopTouches();
            };
        },
        reset: pointer.reset,
        observeClicks: (element) => {
            const onClick = (e: MouseEvent) => {
                if (!hasPendingClick) return;

                hasPendingClick = false;

                e.preventDefault();
                e.stopPropagation();
            };

            element.addEventListener("click", onClick, true);

            return () => element.removeEventListener("click", onClick, true);
        },
        applyTouchAction: (element, isDisabled) => {
            if (isDisabled) {
                element.style.touchAction = "";

                return;
            }

            const axis = opts.getAxis();

            element.style.touchAction = axis === undefined ? FREE_SWIPE_TOUCH_ACTION : SWIPE_TOUCH_ACTIONS[axis];
        },
    };
};

/**
 * Tracks what the user is doing to an element — hover, focus, press, drag, swipe — and reports it
 * as state the element can style itself from.
 *
 * The point of collecting this in one place is that the awkward parts are handled once. Disabled
 * elements stay reachable for a screen reader instead of vanishing from the tab order; focus rings
 * appear for the keyboard and not for the mouse, as the browser itself decides; a swipe yields to a
 * scroller that has not reached its end; and a gesture that has been taken over does not also fire
 * a click at the end.
 *
 * Each tracker here watches an element between `observe` and the function it returns, and can be started
 * again afterwards; what changes over time is held in a store.
 */
export namespace InteractionTrackerUtils {
    /**
     * Whether an element's focus should be shown.
     *
     * Asks the browser rather than tracking the input device, since the platform's own rule is what the
     * user expects and it differs between them.
     *
     * @param element The focused element.
     */
    export const computeIsFocusVisible = (element: HTMLElement) => element.matches(FOCUS_VISIBLE_SELECTOR);

    /**
     * Whether a disabled control should still be reachable by keyboard.
     *
     * A `disabled` control cannot be focused, so a keyboard user never learns it exists, let alone why it
     * is off. A control that opts in stays reachable: it takes focus, announces that it is disabled, and
     * reads whatever tooltip it has. The tooltip is welcome and not required, so that a disabled item with
     * nothing to say is still discoverable.
     *
     * @param isDisabled Whether the control is disabled. An enabled control is reachable anyway, so
     * this reports `false` for one.
     * @param isReachableWhenDisabled Whether the consumer opted in.
     * @param isFocusableWhenDisabled A component's own insistence, for an item its container walks.
     */
    export const computeIsReachable = (
        isDisabled: boolean,
        isReachableWhenDisabled: boolean,
        isFocusableWhenDisabled = false,
    ) => isDisabled && (isReachableWhenDisabled || isFocusableWhenDisabled);

    /**
     * Sets the tab order of one of an element's secondary controls, and stops a disabled one taking focus.
     *
     * For the extra buttons a composite control carries — a clear button in a field, a step button on a
     * number input — which follow the parent's disabled state but are not the thing being tracked.
     * Pressing a disabled one does not steal focus, which is the one behavior a native `disabled`
     * would have given for free.
     *
     * @param element The control.
     * @param opts.isDisabled Whether the parent is disabled.
     * @param opts.isTabbable Pass `false` to take the control out of the tab order while still enabled, for a
     * control reached through its parent rather than directly.
     * @returns The function that stops refusing focus. The tab order is left as it was set.
     */
    export const wrapExtraControl = (element: HTMLElement, opts: { isDisabled: boolean; isTabbable: boolean }) => {
        element.tabIndex = !opts.isDisabled && opts.isTabbable ? 0 : -1;

        if (!opts.isDisabled) return () => {};

        element.addEventListener("mousedown", preventFocusOnPress);

        return () => element.removeEventListener("mousedown", preventFocusOnPress);
    };

    /**
     * The flags a painter reads, from what an element tracker holds and whether the element is disabled.
     *
     * Hover and press are cleared rather than frozen when the element is disabled, so a control disabled
     * while the pointer is over it does not stay stuck looking hovered. Focus is left alone, so a disabled
     * control that is still reachable keeps its ring.
     *
     * @param state What {@link createElementTracker} holds.
     * @param isDisabled Whether the element is disabled.
     * @returns `isHovered`, `isFocused`, `isFocusVisible` and `isActive`. The two focus flags are absent until the
     * element has first been focused or blurred.
     */
    export const computeFlags = (state: InteractionElementState, isDisabled: boolean): InternalInteractionFlags => {
        const { isActiveByMouse, isActiveByKey, ...flags } = state;

        return {
            ...flags,
            isHovered: !isDisabled && (flags.isHovered ?? false),
            isActive: !isDisabled && (isActiveByMouse || isActiveByKey),
        };
    };

    /**
     * Tracks hover, focus and press on an element.
     *
     * The tracker is a store of the raw state; {@link computeFlags} turns it into what a painter reads. Press is
     * tracked separately for mouse and keyboard because they end differently — the mouse on release anywhere, the
     * keyboard on key up or on losing focus. A write that changes nothing is skipped, so a key press that leaves
     * the focus ring as it was notifies nobody.
     *
     * `observe` also writes the element's tab order, and with `applyButtonSemantics` its role, `aria-disabled`
     * and cursor. Observing a disabled element that is not reachable clears every flag, listens for nothing and
     * refuses the press that would focus it.
     *
     * @returns The tracker. `observe(element, opts)` takes `isDisabled`, `isReachable` — the answer from
     * {@link computeIsReachable} — `isTabbable`, `false` to take the element out of the tab order while still
     * enabled, and `applyButtonSemantics`, which uses `aria-disabled` rather than the `disabled` attribute so the
     * element stays focusable and can still explain itself.
     */
    export const createElementTracker = (): InteractionElementTracker => {
        const store = StoreUtils.create(IDLE_ELEMENT_STATE, { isEqual: StoreUtils.getIsShallowEqual });

        const write = (next: Partial<InteractionElementState>) => store.update((current) => ({ ...current, ...next }));

        const readFocusVisible = (element: HTMLElement) => {
            write({ isFocusVisible: computeIsFocusVisible(element) });
        };

        const onFocus = (e: FocusEvent) => {
            write({ isFocused: true });
            readFocusVisible(e.currentTarget as HTMLElement);
        };

        const onBlur = () => {
            write({ isFocused: false, isFocusVisible: false, isActiveByKey: false });
        };

        const onMouseEnter = () => {
            write({ isHovered: true });
        };

        const onMouseLeave = () => {
            write({ isHovered: false, isActiveByMouse: false });
        };

        const onMouseDown = () => {
            write({ isActiveByMouse: true });
        };

        const onMouseUp = () => {
            write({ isActiveByMouse: false });
        };

        const onKeyDown = (e: KeyboardEvent) => {
            readFocusVisible(e.currentTarget as HTMLElement);

            if (!NavigatorUtils.getIsActivationKey(e.key)) return;

            write({ isActiveByKey: true });
        };

        const onKeyUp = () => {
            write({ isActiveByKey: false });
        };

        const observe = (element: HTMLElement, opts: InteractionElementOpts) => {
            element.tabIndex = (!opts.isDisabled || opts.isReachable) && opts.isTabbable ? 0 : -1;

            if (opts.applyButtonSemantics) {
                element.role = "button";
                element.ariaDisabled = String(opts.isDisabled);
                element.style.cursor = !opts.isDisabled ? "pointer" : "not-allowed";
            }

            if (opts.isDisabled && !opts.isReachable) {
                write({
                    isHovered: false,
                    isFocused: false,
                    isFocusVisible: false,
                    isActiveByKey: false,
                    isActiveByMouse: false,
                });

                element.addEventListener("mousedown", preventFocusOnPress);

                return () => element.removeEventListener("mousedown", preventFocusOnPress);
            }

            element.addEventListener("focus", onFocus);
            element.addEventListener("blur", onBlur);
            element.addEventListener("mouseenter", onMouseEnter);
            element.addEventListener("mouseleave", onMouseLeave);
            element.addEventListener("mousedown", onMouseDown);
            element.addEventListener("mouseup", onMouseUp);
            element.addEventListener("keydown", onKeyDown);
            element.addEventListener("keyup", onKeyUp);

            return () => {
                element.removeEventListener("focus", onFocus);
                element.removeEventListener("blur", onBlur);
                element.removeEventListener("mouseenter", onMouseEnter);
                element.removeEventListener("mouseleave", onMouseLeave);
                element.removeEventListener("mousedown", onMouseDown);
                element.removeEventListener("mouseup", onMouseUp);
                element.removeEventListener("keydown", onKeyDown);
                element.removeEventListener("keyup", onKeyUp);
            };
        };

        return { get: store.get, subscribe: store.subscribe, observe };
    };

    /**
     * Watches whether the tab is in the background.
     *
     * Anything on a timer wants this: a carousel should not advance, and a tooltip should not time out,
     * while nobody is watching.
     *
     * @returns A store of whether the page is hidden, read from the document when the watcher is made and kept
     * current between `observe` and the function it returns.
     */
    export const createPageHiddenWatcher = (): InteractionPageHiddenWatcher => {
        const store = StoreUtils.create(document.hidden);

        const onVisibilityChange = () => store.set(document.hidden);

        return {
            get: store.get,
            subscribe: store.subscribe,
            observe: () => {
                document.addEventListener("visibilitychange", onVisibilityChange);

                return () => document.removeEventListener("visibilitychange", onVisibilityChange);
            },
        };
    };

    /**
     * Watches whether the pointer is over an element or focus is inside it.
     *
     * Two of the three reasons to hold something open rather than letting it close on its own — the user is still
     * using it. The third, the tab being in the background, is {@link createPageHiddenWatcher}'s.
     *
     * @returns A store of the two, kept current between `observe` and the function it returns. Stopping leaves
     * them as they were last heard.
     */
    export const createHoldTracker = (): InteractionHoldTracker => {
        const store = StoreUtils.create(IDLE_HOLD_STATE, { isEqual: StoreUtils.getIsShallowEqual });

        const write = (next: Partial<InteractionHoldState>) => store.update((current) => ({ ...current, ...next }));

        const onMouseEnter = () => write({ isHovered: true });
        const onMouseLeave = () => write({ isHovered: false });
        const onFocusIn = () => write({ hasFocusWithin: true });
        const onFocusOut = (event: FocusEvent) => {
            if (!getHasLeft(event)) return;

            write({ hasFocusWithin: false });
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            observe: (element) => {
                element.addEventListener("mouseenter", onMouseEnter);
                element.addEventListener("mouseleave", onMouseLeave);
                element.addEventListener("focusin", onFocusIn);
                element.addEventListener("focusout", onFocusOut);

                return () => {
                    element.removeEventListener("mouseenter", onMouseEnter);
                    element.removeEventListener("mouseleave", onMouseLeave);
                    element.removeEventListener("focusin", onFocusIn);
                    element.removeEventListener("focusout", onFocusOut);
                };
            },
        };
    };

    /**
     * Reports each press of an element, by pointer or by keyboard.
     *
     * Where a plain click handler would do, this adds the two things a visual response needs: where the
     * press landed, for an effect that starts under the pointer, and how many presses there have been,
     * which lets a repeated press restart an animation that is already running. Held keys are ignored,
     * so leaning on Enter does not fire repeatedly. The count carries on across `observe` calls.
     *
     * @param onActivate Called on each press, with the press position as a `0` to `1` ratio across the
     * element — the center for a keyboard press — and a count that increases each time.
     * @returns The tracker.
     */
    export const createActivationTracker = (
        onActivate: (activation: InteractionActivation) => void,
    ): InteractionActivationTracker => {
        let count = 0;

        return {
            observe: (element) => {
                const activate = (ratio: InteractionDragRatio) => {
                    count += 1;

                    onActivate({ ratio, count });
                };

                const onPointerDown = (e: PointerEvent) => {
                    if (e.button !== 0) return;

                    activate(clampRatio(computeRatio(element.getBoundingClientRect(), e.clientX, e.clientY)));
                };

                const onKeyDown = (e: KeyboardEvent) => {
                    if (e.repeat || !NavigatorUtils.getIsActivationKey(e.key)) return;

                    activate(CENTER_RATIO);
                };

                element.addEventListener("pointerdown", onPointerDown);
                element.addEventListener("keydown", onKeyDown);

                return () => {
                    element.removeEventListener("pointerdown", onPointerDown);
                    element.removeEventListener("keydown", onKeyDown);
                };
            },
        };
    };

    /**
     * Reports the pointer's position within an element throughout a drag.
     *
     * Ownership is taken on press rather than after any movement, which is right for a control the
     * whole of which is the target — a slider track, a color area — where a press with no movement
     * should still move the handle.
     *
     * @param opts.onDrag Called on press and on every move, with the position as a `0` to `1` ratio
     * across the element, held inside it however far the pointer strays.
     * @param opts.onDragEnd Called when the drag finishes, saying whether the pointer was released or
     * the gesture was canceled by the system.
     * @returns A store of whether a drag is under way, `observe` to track an element until stopped, and `reset`.
     * Stopping only removes the listeners, so a drag under way survives them being attached again; `reset`
     * forgets it without calling `onDragEnd`, for when the element changes or the control is disabled.
     */
    export const createDragTracker = (opts: {
        onDrag: (ratio: InteractionDragRatio) => void;
        onDragEnd?: (reason: InteractionDragEndReason) => void;
    }): InteractionDragTracker => {
        const pointer = createPointerGesture({
            onDown: (ratio, engage) => {
                engage();
                opts.onDrag(clampRatio(ratio));
            },
            onMove: (ratio) => {
                opts.onDrag(clampRatio(ratio));
            },
            onEnd: (reason) => {
                opts.onDragEnd?.(reason);
            },
        });

        return {
            get: pointer.engaged.get,
            subscribe: pointer.engaged.subscribe,
            observe: pointer.observe,
            reset: pointer.reset,
        };
    };

    /**
     * Tracks a swipe along one axis across an element, and reports which way it committed.
     *
     * The hard part is not the gesture but everything it competes with: the swipe is not owned until it has
     * traveled far enough to be one, an ancestor scroller with room left keeps the gesture, and a swipe that was
     * taken over does not also fire a click at the end. What belongs to this entry point is the axis: the other
     * one is left to the browser to scroll, so a horizontal swipe does not stop the page going up and down, and
     * travel across it takes no part in either the threshold or the verdict.
     *
     * The tracker's `observe` follows the pointer and the touches while the element is enabled; `observeClicks`
     * swallows the click that ends a swipe, and should run whether or not it is; `applyTouchAction` writes the
     * `touch-action` the axis calls for, or clears it while disabled. Stopping `observe` leaves a swipe under way
     * alive; `reset` forgets it, for when the element changes or the control is disabled.
     *
     * Use {@link createFreeSwipeTracker} where all four directions are wanted.
     *
     * @param opts.getAxis Which way the swipe runs.
     * @param opts.getCommitRatio How far across the element the swipe must travel to count, as a
     * fraction. Short of it, the swipe ends without a direction and the caller should spring back.
     * @param opts.onSwipe Called on every move once the gesture is owned, with progress as a signed
     * fraction of the element — negative back along the axis, positive forward.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or
     * `undefined` when it fell short or the system canceled it.
     * @returns The tracker, a store of whether a swipe is under way.
     */
    export const createAxialSwipeTracker = (opts: {
        getAxis: () => SwipeAxis;
        getCommitRatio: () => number;
        onSwipe: (progressRatio: number) => void;
        onSwipeEnd: (direction: SwipeDirection | undefined) => void;
    }) =>
        createSwipeGesture({
            getAxis: opts.getAxis,
            getCommitRatio: opts.getCommitRatio,
            onSwipe: (progress) => opts.onSwipe(getAxisTravel(progress, opts.getAxis())),
            onSwipeEnd: opts.onSwipeEnd,
        });

    /**
     * Tracks a swipe free to go any of the four ways, and reports which one it committed to.
     *
     * Travel is reported on both axes at once, so a card can follow the pointer wherever it goes rather
     * than sliding along a rail. The verdict is still one direction: whichever axis was traveled furthest
     * is the one measured against the commit ratio, and the other is discarded.
     *
     * Claiming both axes means the browser is left none to scroll, so an element tracked this way cannot
     * also be flicked to scroll its page on a touch screen. That is the price of the extra two directions,
     * and it is why {@link createAxialSwipeTracker} is the one to reach for wherever a single axis will do. The
     * tracker is used as that one's is.
     *
     * @param opts.getCommitRatio How far across the element the swipe must travel to count, as a
     * fraction. Short of it, the swipe ends without a direction and the caller should spring back.
     * @param opts.onSwipe Called on every move once the gesture is owned, with signed travel on each
     * axis as a fraction of the element's own width and height.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or
     * `undefined` when it fell short or the system canceled it.
     * @returns The tracker, a store of whether a swipe is under way.
     */
    export const createFreeSwipeTracker = (opts: {
        getCommitRatio: () => number;
        onSwipe: (progress: InteractionDragRatio) => void;
        onSwipeEnd: (direction: SwipeDirection | undefined) => void;
    }) =>
        createSwipeGesture({
            getAxis: () => undefined,
            getCommitRatio: opts.getCommitRatio,
            onSwipe: opts.onSwipe,
            onSwipeEnd: opts.onSwipeEnd,
        });
}
