<script lang="ts">
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextSvelte.types";
    import DefaultExample from "./Examples/Default.svelte";
    import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";
    import {
        STRESS_CELL_COUNT,
        STRESS_ITEM_SIZE,
    } from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";

    const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
        { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
    ];

    let { playback = $bindable(), ...props }: ParticleFieldExampleProps = $props();

    let modalPlayback = $state(true);
    let isOnGraphicsCard = $state(true);
</script>

<div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        label={"On the graphics card"}
        hint={"Draws the stress test's particles in one canvas per field, with the keyframes worked out on the graphics card. Off, every particle is an element of its own."}
        controls={"Sets ParticleFieldProps.renderer in the stress test"}
    >
        <PageCheckField
            value={isOnGraphicsCard}
            ariaLabel={"On the graphics card"}
            onChange={(value) => {
                isOnGraphicsCard = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

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
            <DefaultExample
                {...props}
                bind:playback={modalPlayback}
                cellCount={STRESS_CELL_COUNT}
                renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
            />
        </PageMeasureBox>
    {/snippet}
</StressTest>
