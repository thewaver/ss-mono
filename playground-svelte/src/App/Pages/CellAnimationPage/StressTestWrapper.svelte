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
        STRESS_HOLD_MS,
        STRESS_ITEM_SIZE,
        STRESS_ITERATION_DELAY_MS,
    } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";
    import { CellAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/CellAnimations.const";

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

    const stressPlaybackOpts = $derived({ ...props.playbackOpts, holdMs: STRESS_HOLD_MS });
</script>

<div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        {...CellAnimationKnobs.ON_GRAPHICS_CARD_TEXT}
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
                playbackOpts={stressPlaybackOpts}
                animationIterationDelayMs={STRESS_ITERATION_DELAY_MS}
                bind:playback={modalPlayback}
                cellCount={STRESS_CELL_COUNT}
                renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
            />
        </PageMeasureBox>
    {/snippet}
</StressTest>
