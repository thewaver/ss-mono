import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

/** How long to wait for an animation frame before committing anyway. A background tab stops delivering frames, and a layer that never finishes opening would be stuck. */
const FRAME_FALLBACK_MS = 100;

/**
 * How much longer than the stated duration the backstop timer waits once real animations are being
 * watched. The timer is no longer the thing that decides when a transition is over, so it only has to
 * outlast one that is running slightly behind its own clock; a frame or two of slack is what stops it
 * firing first and calling a running transition finished.
 */
const BACKSTOP_GRACE_MS = 100;

/**
 * Keeps an element mounted long enough to animate out before it disappears.
 *
 * An element removed the instant it is hidden has nothing left to animate, so its exit transition
 * never plays. This holds a second piece of state — whether the transition has finished — and
 * reports the element as still present while it is running.
 */
export namespace ElementFaderUtils {
    /**
     * Drives one element's fade in and out from a visibility accessor.
     *
     * Two things have to be separated for a CSS transition to run at all. The element must be in the
     * document with its starting style applied before the ending style is set, or the browser sees one
     * style and jumps straight to it; so the target is committed on the next animation frame rather
     * than immediately. And the element must stay in the document until the transition has run its
     * course.
     *
     * **How the end of a transition is decided, and why it is not the duration.** Given `getRef`, the
     * transition is over when the browser says every animation on that element and everything inside it
     * has finished. Without one, the only available signal is a timer set to the stated duration — and a
     * timer is a guess about a machine that may be busy, so it can report a transition finished while
     * the element is still moving. Anything that then measures, scrolls to, or unmounts the element acts
     * on a layout that is still changing, and the result differs from one run to the next. The timer
     * stays either way, as the backstop for an element that animates nothing at all, for one whose
     * animation never ends, and for a caller that has no ref to give.
     *
     * The watch covers descendants, because the element that actually carries the transition is usually
     * the consumer's: a popup's shell belongs to the library and the thing that fades belongs to whoever
     * painted it. So `getRef` wants the outermost element the library owns rather than the one with the
     * transition on it.
     *
     * @param getIsVisible Whether the element should be shown.
     * @param opts.getTransitionDurationMs How long the CSS transition takes. With no `getRef` this is
     * what decides when the element is done, so it must match the duration the stylesheet uses; with one
     * it is only the backstop.
     * @param opts.getRef The outermost element the library owns, whose animations — its own and its
     * descendants' — are what the transition is judged by. Leaving it out keeps the timer alone.
     * @param opts.onShow Called when a fade in begins.
     * @param opts.onHide Called when a fade out begins.
     * @returns `getIsVisible`, which stays `true` through the fade out and is what the caller should
     * mount on; `getTransitionTarget`, `0` or `1`, which is what the caller should drive opacity from;
     * `getHasTransitionFinished` for anything that must wait for the animation to settle; and `show`
     * and `hide` for driving it directly.
     */
    export const createFader = (
        getIsVisible: () => boolean,
        opts: {
            getTransitionDurationMs: () => number;
            getRef?: () => HTMLElement | undefined;
            onShow?: () => void;
            onHide?: () => void;
        },
    ) => {
        let transitionTimeout: ReturnType<typeof setTimeout> | undefined;
        let pendingFrameId: number | undefined;
        let pendingFallbackTimeout: ReturnType<typeof setTimeout> | undefined;
        let pendingTarget: 0 | 1 = 0;
        let generation = 0;

        const clearPending = () => {
            if (pendingFrameId !== undefined) {
                cancelAnimationFrame(pendingFrameId);
            }
            clearTimeout(pendingFallbackTimeout);

            pendingFrameId = undefined;
            pendingFallbackTimeout = undefined;
        };

        onCleanup(() => {
            clearPending();
            clearTimeout(transitionTimeout);
        });

        const [getTransitionTarget, setTransitionTarget] = createSignal<0 | 1>(0);
        const [getHasTransitionFinished, setHasTransitionFinished] = createSignal(true);

        const getIsVisibleOrTransitioning = createMemo(() => {
            const transitionTarget = getTransitionTarget();
            const hasTransitionFinished = getHasTransitionFinished();

            return transitionTarget === 1 || !hasTransitionFinished;
        });

        const setTarget = (target: 0 | 1) => {
            if (pendingTarget === target) return;

            pendingTarget = target;
            generation++;

            setHasTransitionFinished(false);

            clearPending();

            const current = generation;

            const settle = () => {
                if (current !== generation) return;

                clearTimeout(transitionTimeout);
                setHasTransitionFinished(true);
            };

            const commit = () => {
                clearPending();

                setTransitionTarget(target);
                clearTimeout(transitionTimeout);

                const running = opts.getRef?.()?.getAnimations({ subtree: true }) ?? [];

                transitionTimeout = setTimeout(
                    settle,
                    opts.getTransitionDurationMs() + (running.length > 0 ? BACKSTOP_GRACE_MS : 0),
                );

                if (running.length > 0) {
                    void Promise.allSettled(running.map((animation) => animation.finished)).then(settle);
                }
            };

            pendingFrameId = requestAnimationFrame(commit);
            pendingFallbackTimeout = setTimeout(commit, FRAME_FALLBACK_MS);

            (target === 1 ? opts.onShow : opts.onHide)?.();
        };

        const show = () => setTarget(1);

        const hide = () => setTarget(0);

        createEffect(() => {
            const isVisible = getIsVisible();

            if (isVisible) {
                show();
            } else {
                hide();
            }
        });

        return {
            getIsVisible: getIsVisibleOrTransitioning,
            getTransitionTarget,
            getHasTransitionFinished,
            show,
            hide,
        };
    };
}
