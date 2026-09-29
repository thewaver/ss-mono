<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersTone";

    type Props = SVGFiltersExampleProps;

    let props: Props = $props();

    let brightness = $state(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    let contrast = $state(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    let inversion = $state(SVGFilterKnobs.Tone.STARTING_INVERSION);
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"tone"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addBrightnessFilter({ amount: brightness })
            .addContrastFilter({ amount: contrast })
            .addInversionFilter({ amount: inversion })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"brightness"}
        label={"Brightness"}
        hint={"How much lighter or darker the picture is. 1 leaves it alone."}
    >
        <PageNumberField
            value={brightness}
            min={SVGFilterKnobs.Tone.MIN_AMOUNT}
            max={SVGFilterKnobs.Tone.MAX_AMOUNT}
            step={SVGFilterKnobs.Tone.AMOUNT_STEP}
            ariaLabel={"Brightness"}
            onInput={(value) => (brightness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"contrast"}
        label={"Contrast"}
        hint={"How far the lights and darks are pushed apart. 1 leaves it alone."}
    >
        <PageNumberField
            value={contrast}
            min={SVGFilterKnobs.Tone.MIN_AMOUNT}
            max={SVGFilterKnobs.Tone.MAX_AMOUNT}
            step={SVGFilterKnobs.Tone.AMOUNT_STEP}
            ariaLabel={"Contrast"}
            onInput={(value) => (contrast = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"inversion"}
        label={"Inversion"}
        hint={"How far the colors are flipped to their opposites. 0 leaves them alone, 1 fully inverts."}
    >
        <PageNumberField
            value={inversion}
            min={SVGFilterKnobs.Tone.MIN_INVERSION}
            max={SVGFilterKnobs.Tone.MAX_INVERSION}
            step={SVGFilterKnobs.Tone.INVERSION_STEP}
            ariaLabel={"Inversion"}
            onInput={(value) => (inversion = value)}
        />
    </PageProp>
</PageExampleKnobs>
