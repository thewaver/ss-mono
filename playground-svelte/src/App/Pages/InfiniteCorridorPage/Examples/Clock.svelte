<script lang="ts">
    import {
        Button,
        InfiniteCorridor,
        MediaQueryMonitorSvelteUtils,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { createSpinDegrees } from "../InfiniteCorridorPage.utils.svelte";
    import type { InfiniteCorridorClockExampleProps } from "../InfiniteCorridorPageSvelte.types";
    import Room from "./Room.svelte";

    type Props = InfiniteCorridorClockExampleProps;

    let props: Props = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let progress = $state(0);
    let isWalking = $state(!getPrefersReducedMotion());

    $effect(() => {
        if (!isWalking) return;

        const lap = props.lapMs;

        let frameId: number;
        let lastMs = performance.now();

        const walk = () => {
            const nowMs = performance.now();

            progress = (progress + (nowMs - lastMs) / lap) % 1;
            lastMs = nowMs;
            frameId = requestAnimationFrame(walk);
        };

        frameId = requestAnimationFrame(walk);

        return () => cancelAnimationFrame(frameId);
    });

    const getSpinDegrees = createSpinDegrees(
        () => props.spinDegreesPerSecond,
        () => isWalking,
    );

    const layout = $derived(props.toLayout(getSpinDegrees()));
</script>

<div class={styles.stage}>
    <div class={styles.frame}>
        <InfiniteCorridor
            items={props.items}
            {layout}
            bind:progress
            glideDurationMs={props.glideDurationMs}
            ariaLabel={"Walking corridor"}
        >
            {#snippet renderItem(name, state)}
                <Room {name} {state} />
            {/snippet}
        </InfiniteCorridor>
    </div>

    <Button
        id={"corridorWalk"}
        ariaLabel={isWalking ? "Pause" : "Walk"}
        onClick={() => {
            isWalking = !isWalking;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={isWalking ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
        {/snippet}
    </Button>
</div>
