<script setup lang="ts">
import { computed, useId } from "vue";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import StressTest from "../../PageComponents/StressTest/StressTest.vue";
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

const props = defineProps<ShapeExampleProps>();

const id = useId();

const iterationConfig = computed(() => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);

const scale = (value: number, configIndex: number) => (value * STRESS_ITEMS[configIndex].size) / styles.exampleSize;

const toClipPath = (clipPath: string) => `path("${clipPath}")`;

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    if (props.strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "stroke");

    return SVGDefsSamples.Gradient.Timed.toConfig({
        family: props.strokeConfigKey,
        defs: props.strokeConfigDefs,
    } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
        getSize: () => size,
        animationDurationMs: props.animationDurationMs,
        colors: props.colors,
        blurWidth: props.blurWidth,
        ...iterationConfig.value.computeDefs(props.animationDurationMs),
    });
};

const computeFillDefs = (configIndex: number, size: Size2d, element: HTMLElement | undefined) => {
    if (props.fillConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

    return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[props.fillConfigKey].computeSVGDefs(`fill-${id}`, undefined, element, {
        getSize: () => size,
        cellSize: {
            width: scale(props.cellSize.width, configIndex),
            height: scale(props.cellSize.height, configIndex),
        },
        animationDurationMs: props.animationDurationMs,
        colors: props.colors,
        blurWidth: props.blurWidth,
        ...iterationConfig.value.computeDefs(props.animationDurationMs),
    });
};
</script>

<template>
    <StressTest :configs="STRESS_ITEMS">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} items` }}</template>

        <template #renderItem="{ configIndex, itemIndex }">
            <Shape
                :join-radii="joinRadii!.map((n) => scale(n, configIndex))"
                :lame-exponents="lameExponents"
                :compute-points="computePoints"
                :compute-stroke-defs="computeStrokeDefs"
                :stroke-geom="[{ thicknesses: edgeThicknesses.map((t) => scale(t, configIndex)) }]"
                :compute-fill-defs="
                    (size: Size2d, element: HTMLElement | undefined) => computeFillDefs(configIndex, size, element)
                "
            >
                <template #renderChildren="{ clipPath }">
                    <div
                        :class="styles.stressExample"
                        :style="{
                            width: `${STRESS_ITEMS[configIndex].size}px`,
                            height: `${STRESS_ITEMS[configIndex].size}px`,
                            clipPath: toClipPath(clipPath),
                        }"
                    >
                        {{ itemIndex }}
                    </div>
                </template>
            </Shape>
        </template>
    </StressTest>
</template>
