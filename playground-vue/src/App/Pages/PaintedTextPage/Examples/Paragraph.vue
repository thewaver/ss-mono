<script setup lang="ts">
import { useId } from "vue";

import { PaintedText } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import testFile from "@thewaver/ss-playground/App/test.svg?raw";
import type { Size2d } from "@thewaver/ss-utils";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

const TEST_ICON = testFile.slice(testFile.indexOf("<svg"));

const props = defineProps<PaintedTextExampleProps>();

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
        >
            One paint runs across <b>every line</b> of a paragraph that <i>wraps like ordinary text</i>, with a
            <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text">link</a>, an image
            <img :class="styles.image" :src="knight" alt="Sir Face" /> and an icon
            <span :class="styles.icon" v-html="TEST_ICON" /> carried along.
            <br />
            <br />A line break starts a new paragraph.
        </PaintedText>
    </div>
</template>
