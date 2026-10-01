<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import { type ToastState, ToastUtils, ToastsStyles as styles } from "@thewaver/ss-components";
    import { GestureUtils } from "@thewaver/ss-utils";

    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import type { ToastsItemProps } from "./Toasts.types.js";

    let { ref = $bindable(), ...props }: ToastsItemProps<T> = $props();

    let item = $state<HTMLDivElement>();
    let swipeOffsetRatio = $state(0);

    $effect(() => {
        ref = item ?? undefined;
    });

    const fader = ElementFaderSvelteUtils.createFader(() => !props.isExiting, {
        getTransitionDurationMs: () => props.transitionDurationMs,
        getRef: () => item ?? undefined,
        onShow: () => props.toast.onShow?.(),
        onHide: () => props.toast.onHide?.(),
    });

    const { getIsSwiping } = InteractionTrackerSvelteUtils.trackAxialSwipe(
        () => item ?? undefined,
        () => props.swipeDirection === undefined || props.isExiting,
        {
            getAxis: () => ToastUtils.computeSwipeAxis(props.swipeDirection),
            getCommitRatio: () => ToastUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                if (!props.swipeDirection) return;

                swipeOffsetRatio = GestureUtils.computeSwipeOffset(progressRatio, props.swipeDirection);
            },
            onSwipeEnd: (direction) => {
                if (direction !== undefined && direction === props.swipeDirection) {
                    props.onSwipeDismiss();

                    return;
                }

                swipeOffsetRatio = 0;
            },
        },
    );

    const isPaused = $derived(props.isPaused || getIsSwiping());

    const countdown = ToastUtils.createCountdown();

    $effect(() => {
        const durationMs = props.toast.durationMs;
        const isHeld = isPaused;

        if (durationMs === undefined) return;

        return untrack(() => countdown.run(durationMs, isHeld, () => props.onElapse()));
    });

    $effect(() => {
        if (!props.isExiting || !fader.getHasTransitionFinished()) return;

        untrack(() => props.onExitEnd());
    });

    const toastState: ToastState = $derived({
        index: props.index,
        count: props.count,
        isPaused,
        sizes: props.sizes,
        swipeDirection: props.swipeDirection,
        swipeOffsetRatio,
        isSwiping: getIsSwiping(),
    });
</script>

<div bind:this={item} class={styles.toastsItem}>
    {@render props.renderToast(props.toast, fader.getTransitionTarget(), props.transitionDurationMs, toastState)}
</div>
