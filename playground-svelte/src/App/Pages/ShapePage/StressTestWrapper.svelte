<script lang="ts">
    import { Shape } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import StressTest from "../../PageComponents/StressTest/StressTest.svelte";
    import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
    import { computeShapeFillDefs, computeShapeStrokeDefs } from "./ShapePage.const";
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

    const getScale = (configIndex: number) => STRESS_ITEMS[configIndex].size / styles.exampleSize;
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
            computeStrokeDefs={(size, element) =>
                computeShapeStrokeDefs(id, props, size, element, undefined, getScale(configIndex))}
            strokeGeom={[
                {
                    thicknesses: props.edgeThicknesses.map(
                        (t) => (t * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                    ),
                },
            ]}
            computeFillDefs={(size, element) =>
                computeShapeFillDefs(id, props, size, element, getScale(configIndex))}
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
