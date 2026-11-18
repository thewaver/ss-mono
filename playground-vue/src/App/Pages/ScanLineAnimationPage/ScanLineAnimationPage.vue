<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    SCANLINE_ANIMATION_DEFAULTS,
    SCANLINE_ANIMATION_ORIENTATIONS,
    SliceAnimationWeights,
} from "@thewaver/ss-components-vue";
import type { ScanlineAnimationOrientation } from "@thewaver/ss-components-vue";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageFileField from "../../PageComponents/Field/PageFileField.vue";
import PageGroupedSelectField from "../../PageComponents/Field/PageGroupedSelectField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import { providePlaybackGroupContext } from "../../PageComponents/PlaybackScrubber/PlaybackGroup.context";
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BrightnessExampleWrapper from "./BrightnessExampleWrapper.vue";
import DropoutExampleWrapper from "./DropoutExampleWrapper.vue";
import GlitchExampleWrapper from "./GlitchExampleWrapper.vue";
import GrayscaleExampleWrapper from "./GrayscaleExampleWrapper.vue";
import HueExampleWrapper from "./HueExampleWrapper.vue";
import InterlaceExampleWrapper from "./InterlaceExampleWrapper.vue";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
import SnakeExampleWrapper from "./SnakeExampleWrapper.vue";
import SplitExampleWrapper from "./SplitExampleWrapper.vue";
import StressTestWrapper from "./StressTestWrapper.vue";
import SurgeExampleWrapper from "./SurgeExampleWrapper.vue";

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

const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.ORIGIN_FREE_WEIGHT_TYPES);

const playback = shallowRef(true);

providePlaybackGroupContext(PlaybackScrubberUtils.useGroup("scanlineGlitch"));

const src = shallowRef(knight);
const lineCount = shallowRef(ScanlineAnimationKnobs.STARTING_LINE_COUNT);
const orientation = shallowRef<ScanlineAnimationOrientation>(SCANLINE_ANIMATION_DEFAULTS.orientation);
const animationDurationMs = shallowRef(ScanlineAnimationKnobs.STARTING_DURATION_MS);
const animationIterationDelayMs = shallowRef(ScanlineAnimationKnobs.STARTING_ITERATION_DELAY_MS);
const weightType = shallowRef<SliceAnimationWeights.OriginFreeWeightType>(ScanlineAnimationKnobs.STARTING_WEIGHT_TYPE);

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
        name: EXAMPLE_NAMES.glitch,
        path: `${EXAMPLES_ROOT}/Glitch.vue`,
    },
    {
        key: "surge",
        name: EXAMPLE_NAMES.surge,
        path: `${EXAMPLES_ROOT}/Surge.vue`,
    },
    {
        key: "snake",
        name: EXAMPLE_NAMES.snake,
        path: `${EXAMPLES_ROOT}/Snake.vue`,
    },
    {
        key: "split",
        name: EXAMPLE_NAMES.split,
        path: `${EXAMPLES_ROOT}/Split.vue`,
    },
    {
        key: "dropout",
        name: EXAMPLE_NAMES.dropout,
        path: `${EXAMPLES_ROOT}/Dropout.vue`,
    },
    {
        key: "brightness",
        name: EXAMPLE_NAMES.brightness,
        path: `${EXAMPLES_ROOT}/Brightness.vue`,
    },
    {
        key: "grayscale",
        name: EXAMPLE_NAMES.grayscale,
        path: `${EXAMPLES_ROOT}/Grayscale.vue`,
    },
    {
        key: "hue",
        name: EXAMPLE_NAMES.hue,
        path: `${EXAMPLES_ROOT}/Hue.vue`,
    },
    {
        key: "interlace",
        name: EXAMPLE_NAMES.interlace,
        path: `${EXAMPLES_ROOT}/Interlace.vue`,
    },
    {
        key: "stressTest",
        name: EXAMPLE_NAMES.stressTest,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PagePropsPanel scope="global">
            <PageProp item-key="image" v-bind="ScanlineAnimationKnobs.IMAGE_TEXT">
                <PageFileField accept="image/*" ariaLabel="Image" @pick="handleFile" />
            </PageProp>

            <PageProp item-key="weightType" v-bind="ScanlineAnimationKnobs.WEIGHT_TYPE_TEXT">
                <PageGroupedSelectField
                    :value="weightType"
                    :groups="GROUPPED_WEIGHTS"
                    ariaLabel="Weight"
                    @change="(value: SliceAnimationWeights.OriginFreeWeightType) => (weightType = value)"
                />
            </PageProp>

            <PageProp item-key="lineCount" v-bind="ScanlineAnimationKnobs.LINE_COUNT_TEXT">
                <PageNumberField
                    :value="lineCount"
                    :min="ScanlineAnimationKnobs.MIN_LINE_COUNT"
                    :max="ScanlineAnimationKnobs.MAX_LINE_COUNT"
                    :step="ScanlineAnimationKnobs.LINE_COUNT_STEP"
                    ariaLabel="Line count"
                    @input="(value: number) => (lineCount = value)"
                />
            </PageProp>

            <PageProp item-key="orientation" v-bind="ScanlineAnimationKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="SCANLINE_ANIMATION_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: ScanlineAnimationOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="animationDurationMs" v-bind="ScanlineAnimationKnobs.ANIMATION_DURATION_MS_TEXT">
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
                v-bind="ScanlineAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT"
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

            <template #dropout>
                <DropoutExampleWrapper v-bind="commonProps" />
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

            <template #interlace>
                <InterlaceExampleWrapper v-bind="commonProps" />
            </template>

            <template #stressTest>
                <StressTestWrapper v-bind="commonProps" />
            </template>
        </PageExamples>
    </div>
</template>
