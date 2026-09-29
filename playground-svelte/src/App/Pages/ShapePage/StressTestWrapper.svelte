<script lang="ts">
    import { SVGDefsSamples, Shape } from "@thewaver/ss-components-svelte";
    import {
        NO_SAMPLE_KEY,
        computeNoSampleDefs,
    } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
    import type { ShapeExampleProps } from "./ShapePage.types";

    const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
        {
            count: 40,
            cols: 8,
            gap: 20,
            size: 160,
        },
        {
            count: 160,
            cols: 16,
            gap: 10,
            size: 80,
        },
        {
            count: 640,
            cols: 32,
            gap: 5,
            size: 40,
        },
    ];

    let props: ShapeExampleProps = $props();

    const id = $props.id();

    const iterationConfig = $derived(SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);
</script>

<StressTest configs={STRESS_ITEMS}>
    {#snippet renderLabel(configIndex)}
        {`Render ${STRESS_ITEMS[configIndex].count} items`}
    {/snippet}

    {#snippet renderItem(configIndex, itemIndex)}
        <Shape
            joinRadii={props.joinRadii!.map((n) => (n * STRESS_ITEMS[configIndex].size) / styles.exampleSize)}
            lameExponents={props.lameExponents}
            computePoints={(size) => ShapeConst.getDefaultShapePoints(props.shapeKind, size)}
            computeStrokeDefs={(size, element) => {
                if (props.strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "stroke");

                return SVGDefsSamples.Gradient.Timed.toConfig({
                    family: props.strokeConfigKey,
                    defs: props.strokeConfigDefs,
                } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
                    getSize: () => size,
                    animationDurationMs: props.animationDurationMs,
                    colors: props.colors,
                    blurWidth: props.blurWidth,
                    ...iterationConfig.computeDefs(props.animationDurationMs),
                });
            }}
            strokeGeom={[
                {
                    thicknesses: props.edgeThicknesses.map(
                        (t) => (t * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                    ),
                },
            ]}
            computeFillDefs={(size, element) => {
                if (props.fillConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

                return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[props.fillConfigKey].computeSVGDefs(
                    `fill-${id}`,
                    undefined,
                    element,
                    {
                        getSize: () => size,
                        cellSize: {
                            width: (props.cellSize.width * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                            height: (props.cellSize.height * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                        },
                        animationDurationMs: props.animationDurationMs,
                        colors: props.colors,
                        blurWidth: props.blurWidth,
                        ...iterationConfig.computeDefs(props.animationDurationMs),
                    },
                );
            }}
        >
            {#snippet renderChildren(_size, clipPath)}
                <div
                    class={styles.stressExample}
                    style:width={`${STRESS_ITEMS[configIndex].size}px`}
                    style:height={`${STRESS_ITEMS[configIndex].size}px`}
                    style:clip-path={`path("${clipPath}")`}
                >
                    {itemIndex}
                </div>
            {/snippet}
        </Shape>
    {/snippet}
</StressTest>
