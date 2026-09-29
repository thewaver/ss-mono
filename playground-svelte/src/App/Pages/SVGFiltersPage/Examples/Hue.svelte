<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersHue";

    type Props = SVGFiltersExampleProps;

    let props: Props = $props();

    let deg = $state(SVGFilterKnobs.Hue.STARTING_DEG);
    let saturation = $state(SVGFilterKnobs.Hue.STARTING_SATURATION);
    let red = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    let green = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    let blue = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"hue"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addHueRotationFilter({ deg })
            .addSaturationFilter({ amount: saturation })
            .addColorChannelFilter({ r: red, g: green, b: blue })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"deg"}
        label={"Hue rotation"}
        hint={"How far every color is turned round the color wheel."}
    >
        <PageNumberField
            value={deg}
            min={SVGFilterKnobs.Hue.MIN_DEG}
            max={SVGFilterKnobs.Hue.MAX_DEG}
            step={SVGFilterKnobs.Hue.DEG_STEP}
            ariaLabel={"Hue rotation"}
            onInput={(value) => (deg = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"saturation"}
        label={"Saturation"}
        hint={"How colorful the result is. 0 takes it to gray, above 1 pushes the colors harder."}
    >
        <PageNumberField
            value={saturation}
            min={SVGFilterKnobs.Hue.MIN_AMOUNT}
            max={SVGFilterKnobs.Hue.MAX_AMOUNT}
            step={SVGFilterKnobs.Hue.AMOUNT_STEP}
            ariaLabel={"Saturation"}
            onInput={(value) => (saturation = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"red"}
        label={"Red"}
        hint={"How much the red channel is scaled on its own, after the hue and saturation have been applied."}
    >
        <PageNumberField
            value={red}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Red"}
            onInput={(value) => (red = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"green"}
        label={"Green"}
        hint={"How much the green channel is scaled on its own, after the hue and saturation have been applied."}
    >
        <PageNumberField
            value={green}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Green"}
            onInput={(value) => (green = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"blue"}
        label={"Blue"}
        hint={"How much the blue channel is scaled on its own, after the hue and saturation have been applied."}
    >
        <PageNumberField
            value={blue}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Blue"}
            onInput={(value) => (blue = value)}
        />
    </PageProp>
</PageExampleKnobs>
