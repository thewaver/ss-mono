<script lang="ts">
    import { STRESS_ITEMS } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import StressItem from "./StressItem.svelte";

    type Props = BaseRGBAnimationExampleProps & { playback: boolean };

    let { playback = $bindable(), ...props }: Props = $props();

    let modalPlayback = $state(true);
</script>

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
        {`Render ${STRESS_ITEMS[configIndex].count} items`}
    {/snippet}

    {#snippet renderItem()}
        <StressItem {...props} bind:modalPlayback />
    {/snippet}
</StressTest>
