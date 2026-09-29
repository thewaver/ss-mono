<script lang="ts">
    import { Button, type ToastState, type ToastsDir } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import PageButtonContent from "../ButtonContent/ButtonContent.svelte";
    import type { ToastContentProps } from "./ToastContent.types";

    const POSITION_OFFSET = 1;
    const PILE_PEEK = 14;
    const PILE_SCALE_STEP = 0.04;
    const PILE_MIN_SCALE = 0.8;
    const PERCENT = 100;

    const computePileShift = (state: ToastState, dir: ToastsDir, gap: number) => {
        const isColumn = dir === "column" || dir === "column-reverse";
        const sign = dir === "column-reverse" || dir === "row-reverse" ? -1 : 1;
        const extents = state.sizes.map((size) => (isColumn ? size.height : size.width));

        const computeFlowStart = (index: number) =>
            extents.slice(0, index).reduce((start, extent) => start + extent + gap, 0);

        const depth = state.count - POSITION_OFFSET - state.index;

        return {
            isColumn,
            shift:
                sign *
                (computeFlowStart(state.count - POSITION_OFFSET) - computeFlowStart(state.index) - PILE_PEEK * depth),
            scale: Math.max(1 - PILE_SCALE_STEP * depth, PILE_MIN_SCALE),
        };
    };

    const computeSwipeShift = (state: ToastState) => {
        const direction = state.swipeDirection;

        if (direction === undefined || state.swipeOffsetRatio === 0) return undefined;

        const distance = state.swipeOffsetRatio * PERCENT * (direction === "left" || direction === "up" ? -1 : 1);

        return direction === "left" || direction === "right" ? `translateX(${distance}%)` : `translateY(${distance}%)`;
    };

    const computeTransform = (props: ToastContentProps) => {
        const pile = props.stacking === "pile" ? computePileShift(props.state, props.dir, props.gap) : undefined;
        const transforms = [
            computeSwipeShift(props.state),
            pile && `translate${pile.isColumn ? "Y" : "X"}(${pile.shift}px) scale(${pile.scale})`,
        ].filter(Boolean);

        return transforms.length > 0 ? transforms.join(" ") : undefined;
    };

    let props: ToastContentProps = $props();

    const meta = $derived(
        `${props.state.index + POSITION_OFFSET} of ${props.state.count}` +
            (props.toast.durationMs === undefined ? " · stays until dismissed" : "") +
            (props.state.isPaused ? " · paused" : ""),
    );
</script>

<PageLayer level={2}>
    <div
        style:transition={`transform ${props.state.isSwiping ? 0 : props.transitionDurationMs}ms`}
        style:transform={computeTransform(props)}
        style:transform-origin="center"
    >
        <div
            class={[
                styles.toastCard,
                styles.toastKindVariants[props.toast.value.kind],
                props.visibilityTarget === 1
                    ? styles.toastAnimationOn
                    : styles.toastAnimationOffVariants[props.animation],
            ]}
            style:transition={`transform ${props.transitionDurationMs}ms, opacity ${props.transitionDurationMs}ms`}
        >
            <div class={styles.toastBody}>
                <div class={styles.toastMessage}>{props.toast.value.message}</div>

                <div class={styles.toastMeta} aria-hidden="true">
                    {meta}
                </div>
            </div>

            <Button onClick={props.onDismiss}>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Close</PageButtonContent>
                {/snippet}
            </Button>

            {#if props.toast.durationMs}
                <div
                    class={styles.toastCountdown}
                    data-countdown=""
                    style:animation-duration={`${props.toast.durationMs}ms`}
                    style:animation-play-state={props.state.isPaused ? "paused" : "running"}
                ></div>
            {/if}
        </div>
    </div>
</PageLayer>
