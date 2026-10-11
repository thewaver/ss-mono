<script lang="ts">
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BlurExample from "./Examples/Blur.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let stdDeviation = $state(SVGFilterKnobs.Blur.STARTING_DEVIATION);
</script>

<BlurExample {...props} {stdDeviation} />

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
