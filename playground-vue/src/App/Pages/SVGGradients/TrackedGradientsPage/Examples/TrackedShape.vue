<script setup lang="ts">
import { useId } from "vue";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TrackedGradientExampleProps } from "../../SVGGradientsVue.types";

type Props = TrackedGradientExampleProps & {
    boxClass?: string;
    groupElement?: HTMLElement;
    groupSize?: Size2d;
};

const props = defineProps<Props>();

const id = useId();

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);

const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, props.paintKind);

    return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
        family: props.configKey,
        defs: props.configDefs,
    } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(
        `${props.paintKind}-${id}`,
        undefined,
        props.groupElement ?? element,
        {
            getSize: () => props.groupSize ?? size,
            colors: props.colors,
            blurWidth: props.blurWidth,
        },
    );
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
            <div :class="boxClass ?? styles.example" />
        </template>
    </Shape>
</template>
