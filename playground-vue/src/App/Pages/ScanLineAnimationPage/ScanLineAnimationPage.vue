<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    CellAnimationWeights,
    SCANLINE_ANIMATION_DEFAULTS,
    SCANLINE_ANIMATION_ORIENTATIONS,
} from "@thewaver/ss-components-vue";
import type { ScanlineAnimationOrientation } from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageFileField from "../../PageComponents/Field/PageFileField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BrightnessExampleWrapper from "./BrightnessExampleWrapper.vue";
import DropoutExampleWrapper from "./DropoutExampleWrapper.vue";
import GlitchExampleWrapper from "./GlitchExampleWrapper.vue";
import GrayscaleExampleWrapper from "./GrayscaleExampleWrapper.vue";
import HueExampleWrapper from "./HueExampleWrapper.vue";
import InterlaceExampleWrapper from "./InterlaceExampleWrapper.vue";
import RollExampleWrapper from "./RollExampleWrapper.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SkewExampleWrapper from "./SkewExampleWrapper.vue";
import SnakeExampleWrapper from "./SnakeExampleWrapper.vue";
import SplitExampleWrapper from "./SplitExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";
import SurgeExampleWrapper from "./SurgeExampleWrapper.vue";
import WaveExampleWrapper from "./WaveExampleWrapper.vue";

const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

const groupOptions = <T extends string>(keys: readonly T[]) => {
    const result: Record<string, T[]> = {};

    for (const key of keys) {
        const group = extractOptionGroupWord(key);

        result[group] ??= [];
        result[group].push(key);
    }

    return Object.entries(result);
};

const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.ORIGIN_FREE_WEIGHT_TYPES);
const EXAMPLES_ROOT = "/src/App/Pages/ScanLineAnimationPage/Examples";

const playback = shallowRef(true);

const src = shallowRef(knight);
const lineCount = shallowRef(ScanlineAnimationKnobs.STARTING_LINE_COUNT);
const orientation = shallowRef<ScanlineAnimationOrientation>(SCANLINE_ANIMATION_DEFAULTS.orientation);
const animationDurationMs = shallowRef(ScanlineAnimationKnobs.STARTING_DURATION_MS);
const animationIterationDelayMs = shallowRef(ScanlineAnimationKnobs.STARTING_ITERATION_DELAY_MS);
const weightType = shallowRef<CellAnimationWeights.OriginFreeWeightType>(ScanlineAnimationKnobs.STARTING_WEIGHT_TYPE);

const handleFile = (file: File) => {
    src.value = URL.createObjectURL(file);
};

const commonProps = computed<ScanlineAnimationExampleProps>(() => ({
    "playback": playback.value,
    "onUpdate:playback": (isPlaying) => {
        playback.value = isPlaying;
    },
    "src": src.value,
    "lineCount": lineCount.value,
    "orientation": orientation.value,
    "weightType": weightType.value,
    "animationDurationMs": animationDurationMs.value,
    "animationIterationDelayMs": animationIterationDelayMs.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "glitch",
        name: "Glitch",
        path: `${EXAMPLES_ROOT}/Glitch.vue`,
    },
    {
        key: "surge",
        name: "Surge",
        path: `${EXAMPLES_ROOT}/Surge.vue`,
    },
    {
        key: "snake",
        name: "Snake",
        path: `${EXAMPLES_ROOT}/Snake.vue`,
    },
    {
        key: "split",
        name: "Split",
        path: `${EXAMPLES_ROOT}/Split.vue`,
    },
    {
        key: "brightness",
        name: "Brightness",
        path: `${EXAMPLES_ROOT}/Brightness.vue`,
    },
    {
        key: "grayscale",
        name: "Grayscale",
        path: `${EXAMPLES_ROOT}/Grayscale.vue`,
    },
    {
        key: "hue",
        name: "Hue",
        path: `${EXAMPLES_ROOT}/Hue.vue`,
    },
    {
        key: "_wave",
        name: "_Wave",
        path: `${EXAMPLES_ROOT}/_Wave.vue`,
    },
    {
        key: "_roll",
        name: "_Roll",
        path: `${EXAMPLES_ROOT}/_Roll.vue`,
    },
    {
        key: "_dropout",
        name: "_Dropout",
        path: `${EXAMPLES_ROOT}/_Dropout.vue`,
    },
    {
        key: "_interlace",
        name: "_Interlace",
        path: `${EXAMPLES_ROOT}/_Interlace.vue`,
    },
    {
        key: "_skew",
        name: "_Skew",
        path: `${EXAMPLES_ROOT}/_Skew.vue`,
    },
    {
        key: "stressTest",
        name: "Stress Test",
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp
                item-key="image"
                label="Image"
                hint="Swaps in a picture of your own, so the sweep can be watched against something other than the sample."
            >
                <PageFileField accept="image/*" ariaLabel="Image" @pick="handleFile" />
            </PageProp>

            <PageProp
                item-key="weightType"
                label="Weight"
                hint="How each line's turn is decided: its position, a wave, a random draw, and so on."
            >
                <PageGroupedSelectField
                    :value="weightType"
                    :groups="GROUPPED_WEIGHTS"
                    ariaLabel="Weight"
                    @change="(value: CellAnimationWeights.OriginFreeWeightType) => (weightType = value)"
                />
            </PageProp>

            <PageProp
                item-key="lineCount"
                label="Line count"
                hint="How many lines the picture is cut into. More lines is a finer sweep and more work per frame."
            >
                <PageNumberField
                    :value="lineCount"
                    :min="ScanlineAnimationKnobs.MIN_LINE_COUNT"
                    :max="ScanlineAnimationKnobs.MAX_LINE_COUNT"
                    :step="ScanlineAnimationKnobs.LINE_COUNT_STEP"
                    ariaLabel="Line count"
                    @input="(value: number) => (lineCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Which way the lines run: rows across the picture, or columns down it. The samples here were written for rows, so on columns they still push sideways and some read their place off the row."
            >
                <PageSelectField
                    :value="orientation"
                    :values="SCANLINE_ANIMATION_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: ScanlineAnimationOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="animationDurationMs"
                label="Animation duration (ms)"
                hint="How long one sweep over the whole picture takes."
            >
                <PageNumberField
                    :value="animationDurationMs"
                    :min="ScanlineAnimationKnobs.MIN_DURATION_MS"
                    :max="ScanlineAnimationKnobs.MAX_DURATION_MS"
                    :step="ScanlineAnimationKnobs.DURATION_STEP_MS"
                    ariaLabel="Animation duration"
                    @input="(value: number) => (animationDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="animationIterationDelayMs"
                label="Iteration delay (ms)"
                hint="How long the picture waits between one sweep and the next."
            >
                <PageNumberField
                    :value="animationIterationDelayMs"
                    :min="ScanlineAnimationKnobs.MIN_ITERATION_DELAY_MS"
                    :max="ScanlineAnimationKnobs.MAX_DURATION_MS"
                    :step="ScanlineAnimationKnobs.DURATION_STEP_MS"
                    ariaLabel="Iteration delay"
                    @input="(value: number) => (animationIterationDelayMs = value)"
                />
            </PageProp>
        </PagePropsPanel>

        <PageExamples :items="examples" layout="flow">
            <template #glitch>
                <GlitchExampleWrapper v-bind="commonProps" />
            </template>

            <template #surge>
                <SurgeExampleWrapper v-bind="commonProps" />
            </template>

            <template #snake>
                <SnakeExampleWrapper v-bind="commonProps" />
            </template>

            <template #split>
                <SplitExampleWrapper v-bind="commonProps" />
            </template>

            <template #brightness>
                <BrightnessExampleWrapper v-bind="commonProps" />
            </template>

            <template #grayscale>
                <GrayscaleExampleWrapper v-bind="commonProps" />
            </template>

            <template #hue>
                <HueExampleWrapper v-bind="commonProps" />
            </template>

            <template #_wave>
                <WaveExampleWrapper v-bind="commonProps" />
            </template>

            <template #_roll>
                <RollExampleWrapper v-bind="commonProps" />
            </template>

            <template #_dropout>
                <DropoutExampleWrapper v-bind="commonProps" />
            </template>

            <template #_interlace>
                <InterlaceExampleWrapper v-bind="commonProps" />
            </template>

            <template #_skew>
                <SkewExampleWrapper v-bind="commonProps" />
            </template>

            <template #stressTest>
                <StressTestWrapper v-bind="commonProps" />
            </template>
        </PageExamples>
    </div>
</template>
