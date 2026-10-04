<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { MORPH_TEXT_DEFAULTS, MediaQueryMonitorVueUtils } from "@thewaver/ss-components-vue";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PaintedExample from "./Examples/Painted.vue";
import WordsExample from "./Examples/Words.vue";

const EXAMPLES_ROOT = "/src/App/Pages/MorphTextPage/Examples";

const NO_MOTION_DURATION_MS = 0;

const morphDurationMs = shallowRef(MORPH_TEXT_DEFAULTS.morphDurationMs);
const maxBlurPx = shallowRef(MORPH_TEXT_DEFAULTS.maxBlurPx);
const word = shallowRef("");
const paintedWord = shallowRef("");

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const commonProps = computed(() => ({
    morphDurationMs: prefersReducedMotion.value ? NO_MOTION_DURATION_MS : morphDurationMs.value,
    maxBlurPx: maxBlurPx.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "words",
        name: "Words in turn",
        readout: () =>
            `showing: ${word.value} — the page changes the word on a timer and the text melts into the next; Pause stops the cycle`,
        path: `${EXAMPLES_ROOT}/Words.vue`,
    },
    {
        key: "painted",
        name: "Painted text",
        readout: () =>
            `showing: ${paintedWord.value} — each copy is a PaintedText with a moving gradient, and the melt still works because the filter sits on the morph's own box`,
        path: `${EXAMPLES_ROOT}/Painted.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="morphDurationMs"
            label="Morph duration (ms)"
            hint="How long one word takes to melt into the next. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="morphDurationMs"
                :min="MorphTextKnobs.MIN_MORPH_DURATION_MS"
                :max="MorphTextKnobs.MAX_MORPH_DURATION_MS"
                :step="MorphTextKnobs.MORPH_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Morph duration in milliseconds"
                @input="(value: number) => (morphDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxBlurPx"
            label="Blur (px)"
            hint="The most either word is blurred while they cross. More blur melts more of the letters together."
        >
            <PageNumberField
                :value="maxBlurPx"
                :min="MorphTextKnobs.MIN_MAX_BLUR_PX"
                :max="MorphTextKnobs.MAX_MAX_BLUR_PX"
                :step="MorphTextKnobs.MAX_BLUR_STEP_PX"
                ariaLabel="Blur in pixels"
                @input="(value: number) => (maxBlurPx = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #words>
            <WordsExample v-bind="commonProps" @word-change="(next: string) => (word = next)" />
        </template>

        <template #painted>
            <PaintedExample v-bind="commonProps" @word-change="(next: string) => (paintedWord = next)" />
        </template>
    </PageExamples>
</template>
