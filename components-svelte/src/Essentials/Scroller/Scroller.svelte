<script lang="ts">
    import { untrack } from "svelte";

    import {
        SCROLLER_DEFAULTS,
        type ScrollerMetrics,
        type ScrollerStepper,
        ScrollerUtils,
        ScrollerStyles as styles,
    } from "@thewaver/ss-components";

    import type { ScrollerProps } from "./Scroller.types.js";

    const getIsSameMetrics = (a: ScrollerMetrics, b: ScrollerMetrics) =>
        a.start === b.start && a.visible === b.visible && a.total === b.total;

    let { progress = $bindable(ScrollerUtils.RATIO_MIN), ...props }: ScrollerProps = $props();

    let track = $state<HTMLDivElement>();
    let metrics = $state.raw(ScrollerUtils.NO_METRICS);

    let reportedRatio = ScrollerUtils.RATIO_MIN;

    const gap = $derived(props.gap ?? SCROLLER_DEFAULTS.gap);
    const padding = $derived(props.padding ?? SCROLLER_DEFAULTS.padding);

    const steps = $derived(
        ScrollerUtils.getSteps(
            props.buttonPlacement ?? SCROLLER_DEFAULTS.buttonPlacement,
            ScrollerUtils.getIsScrollable(metrics),
        ),
    );

    const stepper: ScrollerStepper = {
        getIsAtStart: () => ScrollerUtils.getIsAtStart(metrics),
        getIsAtEnd: () => ScrollerUtils.getIsAtEnd(metrics),
        stepToPrevious: () => ScrollerUtils.stepTo(track ?? undefined, "previous"),
        stepToNext: () => ScrollerUtils.stepTo(track ?? undefined, "next"),
    };

    $effect(() => {
        const ref = track;

        if (!ref) return;

        return untrack(() =>
            ScrollerUtils.observe(ref, (next) => {
                if (!getIsSameMetrics(metrics, next)) metrics = next;
            }),
        );
    });

    $effect(() => {
        const next = ScrollerUtils.computeProgressRatio(metrics);

        untrack(() => {
            reportedRatio = next;
            progress = next;
        });
    });

    $effect(() => {
        const ref = track;
        const ratio = progress;

        if (!ref || ratio === reportedRatio) return;

        untrack(() =>
            ref.scrollTo({ left: ratio * ScrollerUtils.computeScrollRange(ScrollerUtils.readMetrics(ref)) }),
        );
    });

    const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement | null;

        if (!track || !target || target === track) return;

        track.scrollTo({ left: ScrollerUtils.computeRevealTarget(track, target, padding) });
    };
</script>

<div class={styles.scrollerRoot} style:gap={`${gap}px`}>
    {#each steps.leading as step}
        {@render props.renderButton(step, stepper)}
    {/each}

    <div
        bind:this={track}
        class={styles.scrollerTrack}
        style:padding-block={`${padding}px`}
        style:padding-inline-start={`${padding}px`}
        onfocusin={handleFocusIn}
    >
        {@render props.children?.()}

        <div class={styles.scrollerTrackEnd} style:flex-basis={`${padding}px`}></div>
    </div>

    {#each steps.trailing as step}
        {@render props.renderButton(step, stepper)}
    {/each}
</div>
