<script setup lang="ts">
import { useId } from "vue";

import { PaintedText } from "@thewaver/ss-components-vue";
import type { Size2d } from "@thewaver/ss-utils";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps & {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
};

const props = defineProps<Props>();

const id = useId();

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);
</script>

<template>
    <PaintedText
        :compute-fill-defs="computeFillDefs"
        :compute-stroke-defs="computeStrokeDefs"
        :stroke-width="strokeWidth"
        :stroke-alignment="strokeAlignment"
    >
        <div :style="{ fontSize: `${fontSize}px`, lineHeight, fontWeight }">Painted text</div>
    </PaintedText>
</template>
