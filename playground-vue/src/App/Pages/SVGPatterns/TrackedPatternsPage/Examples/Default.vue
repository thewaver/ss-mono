<script setup lang="ts">
import { useId } from "vue";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TrackedPatternExampleProps } from "../../SVGPatterns.types";

type Props = TrackedPatternExampleProps;

const props = defineProps<Props>();

const id = useId();

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) => {
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
};
</script>

<template>
    <Shape :compute-points="computePoints" :compute-fill-defs="computeFillDefs">
        <template #renderChildren>
            <div :class="styles.example" />
        </template>
    </Shape>
</template>
