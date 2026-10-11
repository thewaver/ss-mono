<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersBlurExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersBlur";

    type Props = SVGFiltersBlurExampleProps;

    let props: Props = $props();
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"blur"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addGaussianBlurFilter({ stdDeviation: props.stdDeviation })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>
