<script lang="ts">
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextSvelte.types";
    import SingleTargetExample from "./Examples/SingleTarget.svelte";
    import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";
    import {
        STRESS_BOX_HEIGHT,
        STRESS_BOX_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    const STRESS_ITEMS: (StressTestDefs & { width: number; height: number })[] = [
        { count: 8, cols: 4, gap: 10, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
        { count: 24, cols: 6, gap: 8, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
        { count: 48, cols: 8, gap: 6, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
        { count: 96, cols: 12, gap: 4, width: STRESS_BOX_WIDTH, height: STRESS_BOX_HEIGHT },
    ];

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    let modalPlayback = $state(true);
</script>

<StressTest
    configs={STRESS_ITEMS}
    onShowModal={() => {
        playback = false;
    }}
    onHideModal={() => {
        playback = true;
    }}
>
    {#snippet renderLabel(configIndex)}
        {`Render ${STRESS_ITEMS[configIndex].count} spawners`}
    {/snippet}

    {#snippet renderItem(configIndex)}
        <div
            style:width={`${STRESS_ITEMS[configIndex].width}px`}
            style:height={`${STRESS_ITEMS[configIndex].height}px`}
        >
            <SingleTargetExample {...props} bind:playback={modalPlayback} />
        </div>
    {/snippet}
</StressTest>
