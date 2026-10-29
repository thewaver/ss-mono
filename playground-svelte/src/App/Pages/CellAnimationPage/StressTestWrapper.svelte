<script lang="ts">
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextSvelte.types";
    import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
    import DefaultExample from "./Examples/Default.svelte";
    import {
        STRESS_CELL_COUNT,
        STRESS_ITEM_SIZE,
    } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";

    const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
        {
            count: 4 * 3,
            cols: 4,
            gap: 10,
            size: STRESS_ITEM_SIZE,
        },
        {
            count: 6 * 4,
            cols: 6,
            gap: 10,
            size: STRESS_ITEM_SIZE,
        },
        {
            count: 8 * 6,
            cols: 8,
            gap: 10,
            size: STRESS_ITEM_SIZE,
        },
        {
            count: 12 * 6,
            cols: 12,
            gap: 10,
            size: STRESS_ITEM_SIZE,
        },
    ];

    type Props = CellAnimationSourcedExampleProps & { computeWidth: (longestSide: number) => number };

    let { playback = $bindable(), computeWidth, ...props }: Props = $props();

    let modalPlayback = $state(true);
    let isOnGraphicsCard = $state(true);
</script>

<div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        label={"On the graphics card"}
        hint={"Draws the stress test's cells in one canvas per item, with the keyframes worked out on the graphics card. Off, every cell is an element of its own."}
        controls={"Sets CellAnimationProps.renderer in the stress test"}
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

    {#snippet renderItem(configIndex)}
        <PageMeasureBox width={computeWidth(STRESS_ITEMS[configIndex].size)}>
            <DefaultExample
                {...props}
                bind:playback={modalPlayback}
                cellCount={STRESS_CELL_COUNT}
                renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
            />
        </PageMeasureBox>
    {/snippet}
</StressTest>
