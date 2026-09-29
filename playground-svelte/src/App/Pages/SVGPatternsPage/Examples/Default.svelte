<script lang="ts">
    import { SVGDefsSamples, Shape } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatternsPage/SVGPatternsPage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import type { SVGPatternsExampleProps } from "../SVGPatternsPage.types";

    let props: SVGPatternsExampleProps = $props();

    const id = $props.id();

    const iterationConfig = $derived(SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);
</script>

<Shape
    computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
    computeFillDefs={(size, element) => {
        if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

        return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[props.configKey].computeSVGDefs(`fill-${id}`, undefined, element, {
            getSize: () => size,
            cellSize: props.cellSize,
            animationDurationMs: props.animationDurationMs,
            colors: props.colors,
            blurWidth: props.blurWidth,
            ...iterationConfig.computeDefs(props.animationDurationMs),
        });
    }}
>
    {#snippet renderChildren()}
        <div class={styles.example}></div>
    {/snippet}
</Shape>
