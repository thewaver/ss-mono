import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

/** How long to wait for an animation frame before committing anyway. A background tab stops delivering frames, and a layer that never finishes opening would be stuck. */
const FRAME_FALLBACK_MS = 100;

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
     * course, which is what the duration is for — it is a timer, so it must match the duration the
     * stylesheet actually uses.
     *
     * @param getIsVisible Whether the element should be shown.
     * @param opts.getTransitionDurationMs How long the CSS transition takes. Too short and the element
     * vanishes mid-animation; too long and it lingers.
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
            onShow?: () => void;
            onHide?: () => void;
        },
    ) => {
        let transitionTimeout: ReturnType<typeof setTimeout> | undefined;
        let pendingFrameId: number | undefined;
        let pendingFallbackTimeout: ReturnType<typeof setTimeout> | undefined;
        let pendingTarget: 0 | 1 = 0;

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

            setHasTransitionFinished(false);

            clearPending();

            const commit = () => {
                clearPending();

                setTransitionTarget(target);
                clearTimeout(transitionTimeout);
                transitionTimeout = setTimeout(() => setHasTransitionFinished(true), opts.getTransitionDurationMs());
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
