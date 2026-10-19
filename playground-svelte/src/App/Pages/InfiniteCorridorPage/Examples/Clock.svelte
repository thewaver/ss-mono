<script lang="ts">
    import {
        Button,
        InfiniteCorridor,
        MediaQueryMonitorSvelteUtils,
        watchChange,
    } from "@thewaver/ss-components-svelte";
    import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { createSpinDegrees } from "../InfiniteCorridorPage.utils.svelte";
    import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageSvelte.types";
    import Room from "./Room.svelte";

    type Props = InfiniteCorridorExampleProps;

    let props: Props = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let progress = $state(0);
    let isWalking = $state(!getPrefersReducedMotion());
    let lapMs = $state(props.startingLapMs);

    watchChange(
        () => props.startingLapMs,
        (next) => {
            lapMs = next;
        },
    );

    $effect(() => {
        if (!isWalking) return;

        const lap = lapMs;

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

<PageExampleKnobs>
    <PageProp
        itemKey={"lapMs"}
        controls={"Sets how fast the example clock advances InfiniteCorridorProps.progress"}
        label={"Lap (ms)"}
        hint={"How long the clock takes to walk the whole corridor once, past every room and back to the first."}
    >
        <PageNumberField
            value={lapMs}
            resetValue={props.startingLapMs}
            min={InfiniteCorridorKnobs.MIN_LAP_MS}
            max={InfiniteCorridorKnobs.MAX_LAP_MS}
            step={InfiniteCorridorKnobs.LAP_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Lap duration in milliseconds"}
            onInput={(value) => {
                lapMs = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
