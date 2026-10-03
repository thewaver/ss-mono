<script lang="ts">
    import { SVGDefsSamples, Shape } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import type { TrackedPatternExampleProps } from "../../SVGPatterns.types";

    let props: TrackedPatternExampleProps = $props();

    const id = $props.id();
</script>

<Shape
    computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
    computeFillDefs={(size, element) => {
        if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

        return SVGDefsSamples.Pattern.Tracked.toConfig({
            family: props.configKey,
            defs: props.configDefs,
        } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(`fill-${id}`, undefined, element, {
            getSize: () => size,
            cellSize: props.cellSize,
            colors: props.colors,
            blurWidth: props.blurWidth,
        });
    }}
>
    {#snippet renderChildren()}
        <div class={styles.example}></div>
    {/snippet}
</Shape>
