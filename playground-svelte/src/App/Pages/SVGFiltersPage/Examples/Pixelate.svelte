<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersPixelateExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersPixelate";

    type Props = SVGFiltersPixelateExampleProps;

    let props: Props = $props();
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"pixelate"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addPixelateFilter({ size: props.size })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>
