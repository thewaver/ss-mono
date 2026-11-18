<script lang="ts">
    import { SVGFilterDefs } from "@thewaver/ss-components-svelte";
    import type { SVGDisplacementChannel } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import TurbulenceExample from "./Examples/Turbulence.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let frequencyX = $state(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_X);
    let frequencyY = $state(SVGFilterKnobs.Turbulence.STARTING_FREQUENCY_Y);
    let scale = $state(SVGFilterKnobs.Turbulence.STARTING_SCALE);
    let type = $state(SVGFilterKnobs.Turbulence.STARTING_TYPE);
    let octaves = $state(SVGFilterKnobs.Turbulence.STARTING_OCTAVES);
    let seed = $state(SVGFilterKnobs.Turbulence.STARTING_SEED);
    let xChannel = $state<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_X_CHANNEL);
    let yChannel = $state<SVGDisplacementChannel>(SVGFilterKnobs.Turbulence.STARTING_Y_CHANNEL);
</script>

<TurbulenceExample
    {...props}
    baseFrequency={{ x: frequencyX, y: frequencyY }}
    {scale}
    {type}
    numOctaves={octaves}
    {seed}
    xChannelSelector={xChannel}
    yChannelSelector={yChannel}
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"type"}
        {...SVGFilterKnobs.TYPE_TEXT}
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
        {...SVGFilterKnobs.BASE_FREQUENCY_X_TEXT}
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
        {...SVGFilterKnobs.BASE_FREQUENCY_Y_TEXT}
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
        {...SVGFilterKnobs.SCALE_TEXT}
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
        {...SVGFilterKnobs.NUM_OCTAVES_TEXT}
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
        {...SVGFilterKnobs.SEED_TEXT}
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
        {...SVGFilterKnobs.X_CHANNEL_SELECTOR_TEXT}
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
        {...SVGFilterKnobs.Y_CHANNEL_SELECTOR_TEXT}
    >
        <PageSelectField
            value={yChannel}
            values={SVGFilterDefs.DISPLACEMENT_CHANNELS}
            ariaLabel={"Y channel"}
            onChange={(value) => (yChannel = value)}
        />
    </PageProp>
</PageExampleKnobs>
