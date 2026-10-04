<script setup lang="ts">
import { shallowRef, useId, watch, watchEffect } from "vue";

import { Button, MorphText, PaintedText, SVGDefsSamples } from "@thewaver/ss-components-vue";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import {
    MORPH_PAINT,
    MORPH_PAINT_TIMING,
    PAINTED_WORDS,
} from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import { computePaintDefs } from "../../../PageComponents/PaintPicker/PaintPicker.const";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { MorphTextExampleProps } from "../MorphTextPage.types";

const PAINT_SETTINGS = { colors: SVGDefsSamples.SAMPLE_COLORS, ...MORPH_PAINT_TIMING };

type Props = MorphTextExampleProps;

const props = defineProps<Props>();

const id = useId();

const index = shallowRef(0);
const isPlaying = shallowRef(true);

watchEffect((onCleanup) => {
    if (!isPlaying.value) return;

    const interval = setInterval(() => {
        index.value = (index.value + 1) % PAINTED_WORDS.length;
    }, MorphTextKnobs.CYCLE_MS);

    onCleanup(() => clearInterval(interval));
});

watch(index, (next) => props.onWordChange(PAINTED_WORDS[next]), { immediate: true });

const togglePlaying = () => {
    isPlaying.value = !isPlaying.value;
};

const computeFillDefs = (text: string) => (size: Size2d, element: HTMLElement | undefined) =>
    computePaintDefs(MORPH_PAINT, PAINT_SETTINGS, "fill", `fill-${id}-${text}`, size, element);
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.paintedWord">
            <MorphText :text="PAINTED_WORDS[index]" :morph-duration-ms="morphDurationMs" :max-blur-px="maxBlurPx">
                <template #renderText="text">
                    <PaintedText :compute-fill-defs="computeFillDefs(text)">{{ text }}</PaintedText>
                </template>
            </MorphText>
        </div>

        <Button id="morphPaintedPlayback" @click="togglePlaying">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isPlaying ? "Pause" : "Play" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
