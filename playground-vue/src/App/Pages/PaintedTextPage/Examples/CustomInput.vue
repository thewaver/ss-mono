<script setup lang="ts">
import { useId } from "vue";

import { PaintedText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps & {
    text: string;
};

const props = defineProps<Props>();

const id = useId();

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);
</script>

<template>
    <div :class="styles.paragraph">
        <PaintedText
            :compute-fill-defs="computeFillDefs"
            :compute-stroke-defs="computeStrokeDefs"
            :stroke-width="strokeWidth"
            :stroke-alignment="strokeAlignment"
            >{{ text }}</PaintedText
        >
    </div>
</template>
