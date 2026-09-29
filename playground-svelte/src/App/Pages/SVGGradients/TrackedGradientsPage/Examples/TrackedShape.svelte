<script lang="ts">
    import { SVGDefsSamples, Shape } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import { STROKE_THICKNESS } from "../../SVGGradients.const";
    import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

    type Props = TrackedGradientExampleProps & {
        boxClass?: string;
    };

    let props: Props = $props();

    const id = $props.id();

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, props.paintKind);

        return SVGDefsSamples.Gradient.Tracked.toConfig({
            family: props.configKey,
            defs: props.configDefs,
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`${props.paintKind}-${id}`, undefined, element, {
            getSize: () => size,
            colors: props.colors,
            blurWidth: props.blurWidth,
        });
    };
</script>

<Shape
    computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
    computeFillDefs={props.paintKind === "fill" ? computeDefs : undefined}
    computeStrokeDefs={props.paintKind === "stroke" ? computeDefs : undefined}
    strokeGeom={props.paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
>
    {#snippet renderChildren()}
        <div class={props.boxClass ?? styles.example}></div>
    {/snippet}
</Shape>
