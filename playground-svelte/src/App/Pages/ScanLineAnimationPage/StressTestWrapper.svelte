<script lang="ts">
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import StressItem, { STRESS_ITEMS } from "./StressItem.svelte";

    let { playback = $bindable(), ...props }: ScanlineAnimationExampleProps = $props();

    let modalPlayback = $state(true);
</script>

<div>120 lines</div>

<StressTest
    configs={STRESS_ITEMS}
    onHideModal={() => {
        playback = true;
    }}
    onShowModal={() => {
        playback = false;
    }}
>
    {#snippet renderLabel(configIndex)}
        {`Render ${STRESS_ITEMS[configIndex].count} ${STRESS_ITEMS[configIndex].kind} items`}
    {/snippet}

    {#snippet renderItem(configIndex)}
        <StressItem {...props} {configIndex} bind:modalPlayback />
    {/snippet}
</StressTest>
