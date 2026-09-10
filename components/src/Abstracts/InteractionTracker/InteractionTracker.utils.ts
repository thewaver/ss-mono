import { createEffect, createMemo, createSignal, on, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import { GestureUtils, MathUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import type {
    InteractionActivation,
    InteractionDragEndReason,
    InteractionDragRatio,
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

/**
 * The shared pointer-drag machinery behind dragging and swiping.
 *
 * Two things it settles for both. A gesture is not owned the moment the pointer goes down — the
 * caller decides when to engage, which is what lets a swipe wait to see whether the movement is
 * really a swipe. And once engaged, the pointer is captured, so the gesture survives the pointer
 * leaving the element or the window.
 *
 * @param getRef The element the gesture happens on.
 * @param getIsDisabled Whether to ignore gestures.
 * @param opts.isMeasuredFromStart Measures ratios against the element's rectangle as it was when the
 * gesture began rather than as it is now, for a gesture that moves the element it is being tracked
 * on.
 * @param opts.onDown Called on press, with a chance to engage immediately.
 * @param opts.onMove Called on every move, engaged or not, with a chance to engage.
 * @param opts.onEnd Called only if the gesture was engaged.
 * @returns `getIsEngaged`, true while the gesture is owned.
 */
const trackPointer = (
    getRef: () => HTMLElement | undefined,
    getIsDisabled: () => boolean,
    opts: {
        isMeasuredFromStart?: boolean;
        onDown: (ratio: InteractionDragRatio, engage: () => void) => void;
        onMove: (ratio: InteractionDragRatio, engage: () => void) => void;
        onEnd: (reason: InteractionDragEndReason) => void;
    },
) => {
    const [getIsEngaged, setIsEngaged] = createSignal(false);

    let pointerId: number | undefined;
    let startRect: DOMRect | undefined;

    createEffect(
        on(
            getRef,
            () => {
                pointerId = undefined;
                startRect = undefined;

                setIsEngaged(false);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const ref = getRef();

        if (!ref || getIsDisabled()) {
            pointerId = undefined;
            startRect = undefined;

            setIsEngaged(false);

            return;
        }

        const measure = () => (opts.isMeasuredFromStart && startRect ? startRect : ref.getBoundingClientRect());

        const engage = () => {
            if (pointerId === undefined) return;

            ref.setPointerCapture(pointerId);
            setIsEngaged(true);
        };

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            if (pointerId !== undefined) return;

            pointerId = e.pointerId;
            startRect = ref.getBoundingClientRect();

            opts.onDown(computeRatio(startRect, e.clientX, e.clientY), engage);

            if (getIsEngaged()) e.preventDefault();
        };

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;

            opts.onMove(computeRatio(measure(), e.clientX, e.clientY), engage);

            if (getIsEngaged()) e.preventDefault();
        };

        const onPointerEnd = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;

            const wasEngaged = getIsEngaged();

            if (ref.hasPointerCapture(e.pointerId)) ref.releasePointerCapture(e.pointerId);

            pointerId = undefined;
            startRect = undefined;

            setIsEngaged(false);

            if (wasEngaged) opts.onEnd(e.type === "pointercancel" ? "cancel" : "release");
        };

        ref.addEventListener("pointerdown", onPointerDown);
        ref.addEventListener("pointermove", onPointerMove);
        ref.addEventListener("pointerup", onPointerEnd);
        ref.addEventListener("pointercancel", onPointerEnd);

        onCleanup(() => {
            ref.removeEventListener("pointerdown", onPointerDown);
            ref.removeEventListener("pointermove", onPointerMove);
            ref.removeEventListener("pointerup", onPointerEnd);
            ref.removeEventListener("pointercancel", onPointerEnd);
        });
    });

    return { getIsEngaged };
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
     * A `disabled` control cannot be focused, so a keyboard user can never read the tooltip explaining
     * why it is disabled — which is the one thing they most need. So a disabled control that has a
     * tooltip stays in the tab order, and a caller can insist on it regardless.
     *
     * @param isDisabled Whether the control is disabled. An enabled control is reachable anyway, so
     * this reports `false` for one.
     * @param isReachableWhenDisabled Whether the control opts into this behaviour.
     * @param hasTooltip Whether there is anything to read once focused.
     * @param isFocusableWhenDisabled Forces reachability, tooltip or not.
     */
    export const computeIsReachable = (
        isDisabled: boolean,
        isReachableWhenDisabled: boolean,
        hasTooltip: boolean,
        isFocusableWhenDisabled = false,
    ) => isDisabled && ((isReachableWhenDisabled && hasTooltip) || isFocusableWhenDisabled);

    /**
     * Manages the tab order of an element's secondary controls.
     *
     * For the extra buttons a composite control carries — a clear button in a field, a step button on a
     * number input — which follow the parent's disabled state but are not the thing being tracked.
     * Pressing a disabled one does not steal focus, which is the one behaviour a native `disabled`
     * would have given for free.
     *
     * @param getRefs The controls. Missing entries are skipped, so refs that have not attached yet are
     * fine.
     * @param getIsDisabled Whether the parent is disabled.
     * @param opts.getIsTabbable Pass `false` to take the controls out of the tab order while still
     * enabled, for a control reached through its parent rather than directly.
     */
    export const wrapExtraControls = (
        getRefs: () => Array<HTMLElement | undefined>,
        getIsDisabled: () => boolean,
        opts?: { getIsTabbable?: () => boolean },
    ) => {
        const onDisabledMouseDown = (e: MouseEvent) => {
            e.preventDefault();
        };

        createEffect(() => {
            const isDisabled = getIsDisabled();
            const isTabbable = opts?.getIsTabbable?.() ?? true;

            for (const ref of getRefs()) {
                if (!ref) continue;

                ref.tabIndex = !isDisabled && isTabbable ? 0 : -1;

                if (!isDisabled) continue;

                ref.addEventListener("mousedown", onDisabledMouseDown);

                onCleanup(() => {
                    ref.removeEventListener("mousedown", onDisabledMouseDown);
                });
            }
        });
    };

    /**
     * Tracks hover, focus and press on an element, and reports them as flags.
     *
     * The flags are cleared rather than frozen when the element becomes disabled, so a control disabled
     * while the pointer is over it does not stay stuck looking hovered. Press is tracked separately for
     * mouse and keyboard because they end differently — the mouse on release anywhere, the keyboard on
     * key up or on losing focus.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether the element is disabled.
     * @param opts.applyButtonSemantics Gives the element a button role, `aria-disabled` and a cursor.
     * Uses `aria-disabled` rather than the `disabled` attribute so the element stays focusable and can
     * still explain itself.
     * @param opts.getIsReachable Whether a disabled element should still be focusable — the answer from
     * {@link InteractionTrackerUtils.computeIsReachable}.
     * @param opts.getIsTabbable Pass `false` to take the element out of the tab order while still
     * enabled.
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
        const [internalFlags, setInternalFlags] = createStore<InternalInteractionFlags>({});
        const [getActiveByMouse, setActiveByMouse] = createSignal(false);
        const [getActiveByKey, setActiveByKey] = createSignal(false);

        const getFlags = createMemo(() => {
            const isDisabled = getIsDisabled();

            const flags: InternalInteractionFlags = {
                ...internalFlags,
                isHovered: !isDisabled && (internalFlags.isHovered ?? false),
                isActive: !isDisabled && (getActiveByMouse() || getActiveByKey()),
            };

            return flags;
        });

        const readFocusVisible = (element: HTMLElement) => {
            setInternalFlags("isFocusVisible", computeIsFocusVisible(element));
        };

        const onFocus = (e: FocusEvent) => {
            setInternalFlags("isFocused", true);
            readFocusVisible(e.currentTarget as HTMLElement);
        };

        const onBlur = () => {
            setInternalFlags({ isFocused: false, isFocusVisible: false });
            setActiveByKey(false);
        };

        const onMouseEnter = () => {
            setInternalFlags("isHovered", true);
        };

        const onMouseLeave = () => {
            setInternalFlags("isHovered", false);
            setActiveByMouse(false);
        };

        const onMouseDown = () => {
            setActiveByMouse(true);
        };

        const onMouseUp = () => {
            setActiveByMouse(false);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            readFocusVisible(e.currentTarget as HTMLElement);

            if (e.key !== "Enter" && e.key !== " ") return;

            setActiveByKey(true);
        };

        const onKeyUp = () => {
            setActiveByKey(false);
        };

        const onDisabledMouseDown = (e: MouseEvent) => {
            e.preventDefault();
        };

        createEffect(() => {
            const ref = getRef();
            const isDisabled = getIsDisabled();
            const isReachable = opts?.getIsReachable?.() ?? false;
            const isTabbable = opts?.getIsTabbable?.() ?? true;

            if (!ref) return;

            ref.tabIndex = (!isDisabled || isReachable) && isTabbable ? 0 : -1;

            if (opts?.applyButtonSemantics) {
                ref.role = "button";
                ref.ariaDisabled = String(isDisabled);
                ref.style.cursor = !isDisabled ? "pointer" : "not-allowed";
            }

            if (isDisabled && !isReachable) {
                setInternalFlags({ isHovered: false, isFocused: false, isFocusVisible: false });
                setActiveByKey(false);
                setActiveByMouse(false);

                ref.addEventListener("mousedown", onDisabledMouseDown);

                onCleanup(() => {
                    ref.removeEventListener("mousedown", onDisabledMouseDown);
                });

                return;
            }

            ref.addEventListener("focus", onFocus);
            ref.addEventListener("blur", onBlur);
            ref.addEventListener("mouseenter", onMouseEnter);
            ref.addEventListener("mouseleave", onMouseLeave);
            ref.addEventListener("mousedown", onMouseDown);
            ref.addEventListener("mouseup", onMouseUp);
            ref.addEventListener("keydown", onKeyDown);
            ref.addEventListener("keyup", onKeyUp);

            onCleanup(() => {
                ref.removeEventListener("focus", onFocus);
                ref.removeEventListener("blur", onBlur);
                ref.removeEventListener("mouseenter", onMouseEnter);
                ref.removeEventListener("mouseleave", onMouseLeave);
                ref.removeEventListener("mousedown", onMouseDown);
                ref.removeEventListener("mouseup", onMouseUp);
                ref.removeEventListener("keydown", onKeyDown);
                ref.removeEventListener("keyup", onKeyUp);
            });
        });

        return { getFlags };
    };

    /**
     * Whether the tab is currently in the background.
     *
     * Anything on a timer wants this: a carousel should not advance, and a tooltip should not time out,
     * while nobody is watching.
     *
     * @returns Whether the page is hidden.
     */
    export const trackPageHidden = () => {
        const [getIsPageHidden, setIsPageHidden] = createSignal(document.hidden);

        const onVisibilityChange = () => setIsPageHidden(document.hidden);

        createEffect(() => {
            document.addEventListener("visibilitychange", onVisibilityChange);

            onCleanup(() => {
                document.removeEventListener("visibilitychange", onVisibilityChange);
            });
        });

        return getIsPageHidden;
    };

    /**
     * Whether something should be held open rather than allowed to close on its own.
     *
     * Three reasons to hold, and they are all the same reason from the user's point of view — they are
     * still using it. The pointer is over it, focus is inside it, or the tab is in the background so
     * they are not there to see it at all. An auto-dismissing toast or a carousel checks this before
     * moving on.
     *
     * @param getRef The element to watch.
     * @returns Whether to hold.
     */
    export const trackHold = (getRef: () => HTMLElement | undefined) => {
        const [getIsHovered, setIsHovered] = createSignal(false);
        const [getHasFocusWithin, setHasFocusWithin] = createSignal(false);

        const getIsPageHidden = trackPageHidden();

        const onMouseEnter = () => setIsHovered(true);
        const onMouseLeave = () => setIsHovered(false);
        const onFocusIn = () => setHasFocusWithin(true);
        const onFocusOut = (event: FocusEvent) => {
            if (!getHasLeft(event)) return;

            setHasFocusWithin(false);
        };

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            ref.addEventListener("mouseenter", onMouseEnter);
            ref.addEventListener("mouseleave", onMouseLeave);
            ref.addEventListener("focusin", onFocusIn);
            ref.addEventListener("focusout", onFocusOut);

            onCleanup(() => {
                ref.removeEventListener("mouseenter", onMouseEnter);
                ref.removeEventListener("mouseleave", onMouseLeave);
                ref.removeEventListener("focusin", onFocusIn);
                ref.removeEventListener("focusout", onFocusOut);
            });
        });

        return createMemo(() => getIsHovered() || getHasFocusWithin() || getIsPageHidden());
    };

    /**
     * Reports each press of an element, by pointer or by keyboard.
     *
     * Where a plain click handler would do, this adds the two things a visual response needs: where the
     * press landed, for an effect that starts under the pointer, and how many presses there have been,
     * which lets a repeated press restart an animation that is already running. Held keys are ignored,
     * so leaning on Enter does not fire repeatedly.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore presses.
     * @param onActivate Called on each press, with the press position as a `0` to `1` ratio across the
     * element — the centre for a keyboard press — and a count that increases each time.
     */
    export const trackActivation = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        onActivate: (activation: InteractionActivation) => void,
    ) => {
        let count = 0;

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled()) return;

            const activate = (ratio: InteractionDragRatio) => {
                count += 1;

                onActivate({ ratio, count });
            };

            const onPointerDown = (e: PointerEvent) => {
                if (e.button !== 0) return;

                activate(clampRatio(computeRatio(ref.getBoundingClientRect(), e.clientX, e.clientY)));
            };

            const onKeyDown = (e: KeyboardEvent) => {
                if (e.repeat || (e.key !== "Enter" && e.key !== " ")) return;

                activate(CENTER_RATIO);
            };

            ref.addEventListener("pointerdown", onPointerDown);
            ref.addEventListener("keydown", onKeyDown);

            onCleanup(() => {
                ref.removeEventListener("pointerdown", onPointerDown);
                ref.removeEventListener("keydown", onKeyDown);
            });
        });
    };

    /**
     * Reports the pointer's position within an element throughout a drag.
     *
     * Ownership is taken on press rather than after any movement, which is right for a control the
     * whole of which is the target — a slider track, a colour area — where a press with no movement
     * should still move the handle.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore drags.
     * @param opts.onDrag Called on press and on every move, with the position as a `0` to `1` ratio
     * across the element, held inside it however far the pointer strays.
     * @param opts.onDragEnd Called when the drag finishes, saying whether the pointer was released or
     * the gesture was cancelled by the system.
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
        const { getIsEngaged } = trackPointer(getRef, getIsDisabled, {
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

        return { getIsDragging: getIsEngaged };
    };

    /**
     * Tracks a swipe across an element, and reports which way it committed.
     *
     * The hard part is not the gesture but everything it competes with. Ownership is deferred until the
     * movement passes a threshold, so a tap is still a tap. `touch-action` is set to leave the other
     * axis scrollable, so a horizontal swipe does not stop the page scrolling vertically. Touch moves
     * are cancelled by hand once no ancestor scroller has room left, which is what stops a swipe inside
     * a scroller from fighting it. And the click the browser fires after the gesture is swallowed, so a
     * swipe on a card does not also open it.
     *
     * @param getRef The element to track.
     * @param getIsDisabled Whether to ignore swipes.
     * @param opts.getAxis Which way the swipe runs.
     * @param opts.getCommitRatio How far across the element the swipe must travel to count, as a
     * fraction. Short of it, the swipe ends without a direction and the caller should spring back.
     * @param opts.onSwipe Called on every move once the gesture is owned, with progress as a signed
     * fraction of the element — negative back along the axis, positive forward.
     * @param opts.onSwipeEnd Called when the swipe finishes, with the committed direction, or
     * `undefined` when it fell short or the system cancelled it.
     * @returns `getIsSwiping`.
     */
    export const trackSwipe = (
        getRef: () => HTMLElement | undefined,
        getIsDisabled: () => boolean,
        opts: {
            getAxis: () => SwipeAxis;
            getCommitRatio: () => number;
            onSwipe: (progressRatio: number) => void;
            onSwipeEnd: (direction: SwipeDirection | undefined) => void;
        },
    ) => {
        let origin: InteractionDragRatio | undefined;
        let progressRatio = 0;
        let hasPendingClick = false;

        const { getIsEngaged } = trackPointer(getRef, getIsDisabled, {
            isMeasuredFromStart: true,
            onDown: (ratio) => {
                origin = ratio;
                progressRatio = 0;
                hasPendingClick = false;
            },
            onMove: (ratio, engage) => {
                if (!origin) return;

                progressRatio = GestureUtils.computeSwipeProgress(origin, ratio, opts.getAxis());

                if (!getIsEngaged()) {
                    if (Math.abs(progressRatio) < SWIPE_SLOP_RATIO) return;

                    engage();
                }

                opts.onSwipe(progressRatio);
            },
            onEnd: (reason) => {
                const direction =
                    reason === "cancel"
                        ? undefined
                        : GestureUtils.computeSwipeDirection(progressRatio, opts.getAxis(), opts.getCommitRatio());

                origin = undefined;
                progressRatio = 0;
                hasPendingClick = true;

                opts.onSwipeEnd(direction);
            },
        });

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            ref.style.touchAction = getIsDisabled() ? "" : SWIPE_TOUCH_ACTIONS[opts.getAxis()];
        });

        createEffect(() => {
            const ref = getRef();

            if (!ref || getIsDisabled()) return;

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

                    const axis = opts.getAxis();
                    const delta =
                        axis === "horizontal" ? touch.clientX - startTouch.clientX : touch.clientY - startTouch.clientY;

                    if (delta === 0) return;

                    isOwned = !getHasScrollChainRoom(e.target, ref, axis, delta);
                }

                if (isOwned && e.cancelable) e.preventDefault();
            };

            const onTouchEnd = () => {
                startTouch = undefined;
                isOwned = undefined;
            };

            ref.addEventListener("touchstart", onTouchStart, { passive: true });
            ref.addEventListener("touchmove", onTouchMove, { passive: false });
            ref.addEventListener("touchend", onTouchEnd, { passive: true });
            ref.addEventListener("touchcancel", onTouchEnd, { passive: true });

            onCleanup(() => {
                ref.removeEventListener("touchstart", onTouchStart);
                ref.removeEventListener("touchmove", onTouchMove);
                ref.removeEventListener("touchend", onTouchEnd);
                ref.removeEventListener("touchcancel", onTouchEnd);
            });
        });

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            const onClick = (e: MouseEvent) => {
                if (!hasPendingClick) return;

                hasPendingClick = false;

                e.preventDefault();
                e.stopPropagation();
            };

            ref.addEventListener("click", onClick, true);

            onCleanup(() => {
                ref.removeEventListener("click", onClick, true);
            });
        });

        return { getIsSwiping: getIsEngaged };
    };
}
