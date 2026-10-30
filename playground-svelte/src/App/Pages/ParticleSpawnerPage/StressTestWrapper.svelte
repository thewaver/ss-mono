<script lang="ts">
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressTextSvelte.types";
    import SingleTargetExample from "./Examples/SingleTarget.svelte";
    import type { ParticleSpawnerExampleProps } from "./ParticleSpawnerPage.types";
    import {
        STRESS_ITEM_SIZE,
        STRESS_PARTICLE_COUNT,
        STRESS_SPAWN_DELAY_MS,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";

    const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
        { count: 4 * 3, cols: 4, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 6 * 4, cols: 6, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 8 * 6, cols: 8, gap: 10, size: STRESS_ITEM_SIZE },
        { count: 12 * 6, cols: 12, gap: 10, size: STRESS_ITEM_SIZE },
    ];

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    let modalPlayback = $state(true);
    let isOnGraphicsCard = $state(true);
</script>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        label={"On the graphics card"}
        hint={"Draws each spawner's particles in one canvas that follows them, with their positions worked out as before. Off, every particle is an element of its own."}
        controls={"Sets ParticleSpawnerProps.renderer in the stress test"}
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
        {`Render ${STRESS_ITEMS[configIndex].count} spawners`}
    {/snippet}

    {#snippet renderItem(configIndex)}
        <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
            <SingleTargetExample
                {...props}
                particleCount={STRESS_PARTICLE_COUNT}
                spawnDelayMs={STRESS_SPAWN_DELAY_MS}
                bind:playback={modalPlayback}
                renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
            />
        </PageMeasureBox>
    {/snippet}
</StressTest>
