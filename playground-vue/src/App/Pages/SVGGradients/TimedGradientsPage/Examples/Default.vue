<script setup lang="ts">
import { computed, useId } from "vue";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { STROKE_THICKNESS } from "../../SVGGradients.const";
import type { TimedGradientExampleProps } from "../../SVGGradients.types";

type Props = TimedGradientExampleProps;

const props = defineProps<Props>();

const id = useId();

const iterationConfig = computed(() => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, props.paintKind);

    return SVGDefsSamples.Gradient.Timed.toConfig({
        family: props.configKey,
        defs: props.configDefs,
    } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`${props.paintKind}-${id}`, undefined, element, {
        getSize: () => size,
        animationDurationMs: props.animationDurationMs,
        colors: props.colors,
        blurWidth: props.blurWidth,
        ...iterationConfig.value.computeDefs(props.animationDurationMs),
    });
};
</script>

<template>
    <Shape
        :compute-points="computePoints"
        :compute-fill-defs="paintKind === 'fill' ? computeDefs : undefined"
        :compute-stroke-defs="paintKind === 'stroke' ? computeDefs : undefined"
        :stroke-geom="paintKind === 'stroke' ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined"
    >
        <template #renderChildren>
            <div :class="styles.example" />
        </template>
    </Shape>
</template>
