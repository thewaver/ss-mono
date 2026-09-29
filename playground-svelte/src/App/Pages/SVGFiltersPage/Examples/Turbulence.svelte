<script lang="ts">
    import { SVGFilterDefs, SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import type { SVGDisplacementChannel } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersTurbulence";

    type Props = SVGFiltersExampleProps;

    let props: Props = $props();

    let frequencyX = $state(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    let frequencyY = $state(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    let scale = $state(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    let type = $state(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    let octaves = $state(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    let seed = $state(SVGFilterKnobs.Turbulence.STARTING_SEED);
    let xChannel = $state<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
    let yChannel = $state<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"bend"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addTurbulenceFilter({
                baseFrequency: { x: frequencyX, y: frequencyY },
                scale,
                type,
                numOctaves: octaves,
                seed,
                xChannelSelector: xChannel,
                yChannelSelector: yChannel,
            })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"type"}
        label={"Type"}
        hint={"Which noise is generated: fractal noise is soft and cloudy, turbulence is sharper and more veined."}
    >
        <PageSelectField
            value={type}
            values={SVGFilterDefs.TURBULENCE_TYPES}
            ariaLabel={"Type"}
            onChange={(value) => (type = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"baseFrequencyX"}
        label={"Base frequency x"}
        hint={"How fine the noise is across. Higher numbers make a tighter grain."}
    >
        <PageNumberField
            value={frequencyX}
            min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
            max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
            step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
            ariaLabel={"Base frequency x"}
            onInput={(value) => (frequencyX = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"baseFrequencyY"}
        label={"Base frequency y"}
        hint={"How fine the noise is down. Set it apart from the across value to stretch the grain."}
    >
        <PageNumberField
            value={frequencyY}
            min={SVGFilterKnobs.Turbulence.MIN_FREQUENCY}
            max={SVGFilterKnobs.Turbulence.MAX_FREQUENCY}
            step={SVGFilterKnobs.Turbulence.FREQUENCY_STEP}
            ariaLabel={"Base frequency y"}
            onInput={(value) => (frequencyY = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"scale"}
        label={"Scale"}
        hint={"How far the noise pushes the picture about. 0 leaves the picture where it was."}
    >
        <PageNumberField
            value={scale}
            min={SVGFilterKnobs.Turbulence.MIN_SCALE}
            max={SVGFilterKnobs.Turbulence.MAX_SCALE}
            ariaLabel={"Scale"}
            onInput={(value) => (scale = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"numOctaves"}
        label={"Octaves"}
        hint={"How many layers of noise are piled up. More layers add fine detail and cost more to draw."}
    >
        <PageNumberField
            value={octaves}
            min={SVGFilterKnobs.Turbulence.MIN_OCTAVES}
            max={SVGFilterKnobs.Turbulence.MAX_OCTAVES}
            ariaLabel={"Octaves"}
            onInput={(value) => (octaves = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"seed"}
        label={"Seed"}
        hint={"The number the random noise is grown from. Change it for a different pattern at the same settings."}
    >
        <PageNumberField
            value={seed}
            min={SVGFilterKnobs.Turbulence.MIN_SEED}
            max={SVGFilterKnobs.Turbulence.MAX_SEED}
            ariaLabel={"Seed"}
            onInput={(value) => (seed = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"xChannelSelector"}
        label={"X channel"}
        hint={"Which channel of the noise decides how far each point moves sideways."}
    >
        <PageSelectField
            value={xChannel}
            values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
            ariaLabel={"X channel"}
            onChange={(value) => (xChannel = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"yChannelSelector"}
        label={"Y channel"}
        hint={"Which channel of the noise decides how far each point moves up or down."}
    >
        <PageSelectField
            value={yChannel}
            values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
            ariaLabel={"Y channel"}
            onChange={(value) => (yChannel = value)}
        />
    </PageProp>
</PageExampleKnobs>
