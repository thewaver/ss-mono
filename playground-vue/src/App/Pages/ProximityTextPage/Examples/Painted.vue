<script setup lang="ts">
import { useId } from "vue";

import { PaintedText, ProximityText, SVGDefsSamples } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import type { ProximityTextExampleProps } from "../ProximityTextPageVue.types";

const GRADIENT_DURATION_MS = 4000;
const NO_BLUR = 0;

type Props = ProximityTextExampleProps;

defineProps<Props>();

const id = useId();

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    SVGDefsSamples.Gradient.Timed.toConfig({ family: "flow_diag_3" }).computeSVGDefs(`fill-${id}`, undefined, element, {
        getSize: () => size,
        animationDurationMs: GRADIENT_DURATION_MS,
        colors: SVGDefsSamples.SAMPLE_COLORS,
        blurWidth: NO_BLUR,
    });
</script>

<template>
    <div :class="styles.variableText">
        <ProximityText :reach-px="reachPx" :is-disabled="isDisabled">
            <PaintedText :compute-fill-defs="computeFillDefs">Painted letters push their neighbors along</PaintedText>
        </ProximityText>
    </div>
</template>
