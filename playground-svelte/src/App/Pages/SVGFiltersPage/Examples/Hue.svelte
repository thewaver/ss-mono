<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersHueExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersHue";

    type Props = SVGFiltersHueExampleProps;

    let props: Props = $props();
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"hue"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addHueRotationFilter({ deg: props.deg })
            .addSaturationFilter({ amount: props.saturation })
            .addColorChannelFilter({ r: props.r, g: props.g, b: props.b })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>
