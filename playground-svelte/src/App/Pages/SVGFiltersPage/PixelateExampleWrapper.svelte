<script lang="ts">
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PixelateExample from "./Examples/Pixelate.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let size = $state(SVGFilterKnobs.Pixelate.STARTING_SIZE);
</script>

<PixelateExample {...props} {size} />

<PageExampleKnobs>
    <PageProp
        itemKey={"pixelSize"}
        label={"Square size (px)"}
        hint={"How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."}
    >
        <PageNumberField
            value={size}
            min={SVGFilterKnobs.Pixelate.MIN_SIZE}
            max={SVGFilterKnobs.Pixelate.MAX_SIZE}
            step={SVGFilterKnobs.Pixelate.SIZE_STEP}
            ariaLabel={"Square size in pixels"}
            onInput={(value) => (size = value)}
        />
    </PageProp>
</PageExampleKnobs>
