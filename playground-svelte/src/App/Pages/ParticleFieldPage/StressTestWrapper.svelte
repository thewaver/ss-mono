<script lang="ts">
    import type { Index2d } from "@thewaver/ss-utils";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
    import DefaultExample from "./Examples/Default.svelte";
    import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

    const STRESS_CELL_COUNT: Index2d = { col: 11, row: 11 };
    const STRESS_ITEM_SIZE = 120;
    const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
        { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
    ];

    let { playback = $bindable(), ...props }: ParticleFieldExampleProps = $props();

    let modalPlayback = $state(true);
</script>

<div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

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
        {`Render ${STRESS_ITEMS[configIndex].count} fields`}
    {/snippet}

    {#snippet renderItem(configIndex)}
        <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
            <DefaultExample {...props} bind:playback={modalPlayback} cellCount={STRESS_CELL_COUNT} />
        </PageMeasureBox>
    {/snippet}
</StressTest>
