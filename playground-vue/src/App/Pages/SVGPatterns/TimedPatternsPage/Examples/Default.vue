<script setup lang="ts">
import { computed, useId } from "vue";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TimedPatternExampleProps } from "../../SVGPatterns.types";

type Props = TimedPatternExampleProps;

const props = defineProps<Props>();

const id = useId();

const iterationConfig = computed(() => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey]);

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) => {
    if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

    return SVGDefsSamples.Pattern.Timed.SAMPLE_CONFIGS[props.configKey].computeSVGDefs(
        `fill-${id}`,
        undefined,
        element,
        {
            getSize: () => size,
            cellSize: props.cellSize,
            animationDurationMs: props.animationDurationMs,
            colors: props.colors,
            blurWidth: props.blurWidth,
            ...iterationConfig.value.computeDefs(props.animationDurationMs),
        },
    );
};
</script>

<template>
    <Shape :compute-points="computePoints" :compute-fill-defs="computeFillDefs">
        <template #renderChildren>
            <div :class="styles.example" />
        </template>
    </Shape>
</template>
