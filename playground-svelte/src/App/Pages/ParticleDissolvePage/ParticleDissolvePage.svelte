<script lang="ts">
    import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
    import {
        EXAMPLES_ROOT,
        EXAMPLE_NAMES,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import CardExampleWrapper from "./CardExampleWrapper.svelte";
    import ButtonExample from "./Examples/Button.svelte";
    import ImageExampleWrapper from "./ImageExampleWrapper.svelte";
    import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSvelte.types";
    import StressTestWrapper from "./StressTestWrapper.svelte";
    import SvgExampleWrapper from "./SvgExampleWrapper.svelte";

    let durationMs = $state(PARTICLE_DISSOLVE_DEFAULTS.durationMs);
    let particleLifetimeMs = $state(PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs);
    let featherShare = $state(PARTICLE_DISSOLVE_DEFAULTS.featherShare);
    let spawnChance = $state(PARTICLE_DISSOLVE_DEFAULTS.spawnChance);
    let cellSize = $state(PARTICLE_DISSOLVE_DEFAULTS.cellSize);

    const commonProps: ParticleDissolveExampleProps = $derived({
        durationMs,
        particleLifetimeMs,
        featherShare,
        spawnChance,
        cellSize,
    });

    const examples: ExampleDefs[] = [
        {
            key: "button",
            name: EXAMPLE_NAMES.button,
            readout: () => "burns away outward from the point it was pressed, and the Rebuild button brings it back",
            component: buttonExample,
            path: `${EXAMPLES_ROOT}/Button.svelte`,
        },
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            readout: () =>
                "dissolves along a straight edge at the angle set in this example's knobs; particles rise only from the text and the painted boxes, never from the empty parts of the card",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
        {
            key: "svg",
            name: EXAMPLE_NAMES.svg,
            readout: () =>
                "an SVG shape, read point by point against its fill and stroke, so a triangle sheds ash only from the triangle",
            component: svgExample,
            path: `${EXAMPLES_ROOT}/Svg.svelte`,
        },
        {
            key: "image",
            name: EXAMPLE_NAMES.image,
            readout: () =>
                "a picture, read pixel by pixel: ash rises only from what is shown, in the colors it is shown in, and never from the transparent parts",
            component: imageExample,
            path: `${EXAMPLES_ROOT}/Image.svelte`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: stressTest,
        },
    ];
</script>

{#snippet buttonExample()}
    <ButtonExample {...commonProps} />
{/snippet}

{#snippet cardExample()}
    <CardExampleWrapper {...commonProps} />
{/snippet}

{#snippet svgExample()}
    <SvgExampleWrapper {...commonProps} />
{/snippet}

{#snippet imageExample()}
    <ImageExampleWrapper {...commonProps} />
{/snippet}

{#snippet stressTest()}
    <StressTestWrapper {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"durationMs"}
        {...ParticleDissolveKnobs.DURATION_MS_TEXT}
    >
        <PageNumberField
            value={durationMs}
            min={ParticleDissolveKnobs.MIN_DURATION_MS}
            max={ParticleDissolveKnobs.MAX_DURATION_MS}
            step={ParticleDissolveKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Duration in milliseconds"}
            onInput={(value) => {
                durationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"particleLifetimeMs"}
        {...ParticleDissolveKnobs.PARTICLE_LIFETIME_MS_TEXT}
    >
        <PageNumberField
            value={particleLifetimeMs}
            min={ParticleDissolveKnobs.MIN_LIFETIME_MS}
            max={ParticleDissolveKnobs.MAX_LIFETIME_MS}
            step={ParticleDissolveKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Lifetime in milliseconds"}
            onInput={(value) => {
                particleLifetimeMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"featherShare"}
        {...ParticleDissolveKnobs.FEATHER_SHARE_TEXT}
    >
        <PageNumberField
            value={featherShare}
            min={ParticleDissolveKnobs.MIN_FEATHER}
            max={ParticleDissolveKnobs.MAX_FEATHER}
            step={ParticleDissolveKnobs.FEATHER_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Feather"}
            onInput={(value) => {
                featherShare = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"spawnChance"}
        {...ParticleDissolveKnobs.SPAWN_CHANCE_TEXT}
    >
        <PageNumberField
            value={spawnChance}
            min={ParticleDissolveKnobs.MIN_SPAWN_CHANCE}
            max={ParticleDissolveKnobs.MAX_SPAWN_CHANCE}
            step={ParticleDissolveKnobs.SPAWN_CHANCE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Spawn chance"}
            onInput={(value) => {
                spawnChance = value;
            }}
        />
    </PageProp>


    <PageProp
        itemKey={"cellSize"}
        {...ParticleDissolveKnobs.CELL_SIZE_TEXT}
    >
        <PageNumberField
            value={cellSize}
            min={ParticleDissolveKnobs.MIN_CELL_SIZE}
            max={ParticleDissolveKnobs.MAX_CELL_SIZE}
            step={ParticleDissolveKnobs.CELL_SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Cell size in pixels"}
            onInput={(value) => {
                cellSize = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
