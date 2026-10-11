<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";

    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersTurbulenceExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersTurbulence";

    type Props = SVGFiltersTurbulenceExampleProps;

    let props: Props = $props();
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"bend"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addTurbulenceFilter({
                baseFrequency: props.baseFrequency,
                scale: props.scale,
                type: props.type,
                numOctaves: props.numOctaves,
                seed: props.seed,
                xChannelSelector: props.xChannelSelector,
                yChannelSelector: props.yChannelSelector,
            })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>
