<script lang="ts">
    import { STRESS_ITEMS } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import StressItem from "./StressItem.svelte";

    type Props = BaseRGBAnimationExampleProps & { playback: boolean };

    let { playback = $bindable(), ...props }: Props = $props();

    let modalPlayback = $state(true);
    let isOnGraphicsCard = $state(true);
</script>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        label={"On the graphics card"}
        hint={"Draws the stress test's channels in one canvas per item, with the keyframes worked out on the graphics card. Off, every channel is an element of its own."}
        controls={"Sets RGBAnimationProps.renderer in the stress test"}
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

    {#snippet renderItem()}
        <StressItem {...props} bind:modalPlayback renderer={isOnGraphicsCard ? "graphics_card" : "elements"} />
    {/snippet}
</StressTest>
