<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersBlur";

    type Props = SVGFiltersExampleProps;

    let props: Props = $props();

    let stdDeviation = $state(SVGFilterKnobs.Blur.STARTING_DEVIATION);
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"blur"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addGaussianBlurFilter({ stdDeviation })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"stdDeviation"}
        label={"Std deviation"}
        hint={"How far the blur reaches. 0 leaves the picture sharp."}
    >
        <PageNumberField
            value={stdDeviation}
            min={SVGFilterKnobs.Blur.MIN_DEVIATION}
            max={SVGFilterKnobs.Blur.MAX_DEVIATION}
            step={SVGFilterKnobs.Blur.DEVIATION_STEP}
            ariaLabel={"Standard deviation"}
            onInput={(value) => (stdDeviation = value)}
        />
    </PageProp>
</PageExampleKnobs>
