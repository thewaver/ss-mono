<script lang="ts">
    import {
        STRESS_CELL_SIZE,
        STRESS_ITEMS,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSvelte.types";
    import StressCard from "./StressCard.svelte";
    import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";

    let props: ParticleDissolveExampleProps = $props();

    let isOnGraphicsCard = $state(true);
</script>

<div>{`${STRESS_CELL_SIZE} px cells`}</div>

<PagePropsPanel scope={"local"} hasReset={false}>
    <PageProp
        itemKey={"onGraphicsCard"}
        {...ParticleDissolveKnobs.ON_GRAPHICS_CARD_TEXT}
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

<StressTest configs={STRESS_ITEMS}>
    {#snippet renderLabel(configIndex)}
        {`Render ${STRESS_ITEMS[configIndex].count} cards`}
    {/snippet}

    {#snippet renderItem()}
        <StressCard {...props} {isOnGraphicsCard} />
    {/snippet}
</StressTest>
