<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersToneExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersTone";

    type Props = SVGFiltersToneExampleProps;

    let props: Props = $props();
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"tone"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addBrightnessFilter({ amount: props.brightness })
            .addContrastFilter({ amount: props.contrast })
            .addInversionFilter({ amount: props.inversion })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>
