<script lang="ts">
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import StressItem, { STRESS_ITEMS } from "./StressItem.svelte";

    let { playback = $bindable(), ...props }: ScanlineAnimationExampleProps = $props();

    let modalPlayback = $state(true);
    let isOnGraphicsCard = $state(true);
</script>

<div>120 lines</div>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        label={"On the graphics card"}
        hint={"Draws the stress test's lines in one canvas per item, with the keyframes worked out on the graphics card. Off, every line is an element of its own."}
        controls={"Sets ScanlineAnimationProps.renderer in the stress test"}
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
        {`Render ${STRESS_ITEMS[configIndex].count} ${STRESS_ITEMS[configIndex].kind} items`}
    {/snippet}

    {#snippet renderItem(configIndex)}
        <StressItem
            {...props}
            {configIndex}
            bind:modalPlayback
            renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
        />
    {/snippet}
</StressTest>
