<script setup lang="ts">
import { useId } from "vue";

import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import StressTest from "../../PageComponents/StressTest/StressTest.vue";
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

const props = defineProps<ShapeExampleProps>();

const id = useId();

const scale = (value: number, configIndex: number) => (value * STRESS_ITEMS[configIndex].size) / styles.exampleSize;

const toClipPath = (clipPath: string) => `path("${clipPath}")`;

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);

const computeStrokeDefs = (configIndex: number, size: Size2d, element: HTMLElement | undefined) =>
    computeShapeStrokeDefs(id, props, size, element, undefined, scale(1, configIndex));

const computeFillDefs = (configIndex: number, size: Size2d, element: HTMLElement | undefined) =>
    computeShapeFillDefs(id, props, size, element, scale(1, configIndex));
</script>

<template>
    <StressTest :configs="STRESS_ITEMS">
        <template #renderLabel="{ configIndex }">{{ `Render ${STRESS_ITEMS[configIndex].count} items` }}</template>

        <template #renderItem="{ configIndex, itemIndex }">
            <Shape
                :join-radii="joinRadii!.map((n) => scale(n, configIndex))"
                :lame-exponents="lameExponents"
                :compute-points="computePoints"
                :compute-stroke-defs="
                    (size: Size2d, element: HTMLElement | undefined) => computeStrokeDefs(configIndex, size, element)
                "
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
