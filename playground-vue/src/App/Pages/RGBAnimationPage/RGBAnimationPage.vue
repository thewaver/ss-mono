<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { RGB_ANIMATION_DEFAULTS } from "@thewaver/ss-components-vue";
import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    HEADLINE_SOURCE,
    SOURCE_KEYS,
    SOURCE_LABELS,
    SOURCE_WIDTHS,
} from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import type {
    BaseRGBAnimationExampleProps,
    RGBAnimationSourceKey,
} from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import AnaglyphExampleWrapper from "./AnaglyphExampleWrapper.vue";
import EchoExampleWrapper from "./EchoExampleWrapper.vue";
import FocusPullExampleWrapper from "./FocusPullExampleWrapper.vue";
import GlitchExampleWrapper from "./GlitchExampleWrapper.vue";
import HueSwapExampleWrapper from "./HueSwapExampleWrapper.vue";
import OrbitExampleWrapper from "./OrbitExampleWrapper.vue";
import SwellExampleWrapper from "./SwellExampleWrapper.vue";
import TiltExampleWrapper from "./TiltExampleWrapper.vue";
import TwistExampleWrapper from "./TwistExampleWrapper.vue";

type ColorMixingChoice = (typeof RGBAnimationKnobs.COLOR_MIXING_CHOICES)[number];

const SOURCES: Record<RGBAnimationSourceKey, string> = { knight: knightProfile, text: HEADLINE_SOURCE };

const glitchPlayback = shallowRef(true);
const glitchProgress = shallowRef(0);
const swellPlayback = shallowRef(true);
const swellProgress = shallowRef(0);
const orbitPlayback = shallowRef(true);
const orbitProgress = shallowRef(0);
const twistPlayback = shallowRef(true);
const twistProgress = shallowRef(0);
const tiltPlayback = shallowRef(true);
const tiltProgress = shallowRef(0);
const anaglyphPlayback = shallowRef(true);
const anaglyphProgress = shallowRef(0);
const echoPlayback = shallowRef(true);
const echoProgress = shallowRef(0);
const hueSwapPlayback = shallowRef(true);
const hueSwapProgress = shallowRef(0);
const focusPullPlayback = shallowRef(true);
const focusPullProgress = shallowRef(0);

const animationDurationMs = shallowRef(RGB_ANIMATION_DEFAULTS.animationDurationMs);
const animationIterationDelayMs = shallowRef(RGB_ANIMATION_DEFAULTS.animationIterationDelayMs);
const sourceKey = shallowRef<RGBAnimationSourceKey>(RGBAnimationKnobs.STARTING_SOURCE);
const colorMixingChoice = shallowRef<ColorMixingChoice>(RGBAnimationKnobs.FROM_COLOR_SCHEME);

const commonProps = computed<BaseRGBAnimationExampleProps>(() => ({
    colorMixing: colorMixingChoice.value === RGBAnimationKnobs.FROM_COLOR_SCHEME ? undefined : colorMixingChoice.value,
    animationDurationMs: animationDurationMs.value,
    animationIterationDelayMs: animationIterationDelayMs.value,
    src: SOURCES[sourceKey.value],
    ariaLabel: SOURCE_LABELS[sourceKey.value],
}));

const boxWidth = computed(() => SOURCE_WIDTHS[sourceKey.value]);

const examples: ExampleDefs[] = [
    {
        key: "glitch",
        name: EXAMPLE_NAMES.glitch,
        readout: () =>
            "a cluster of tears mid-pass, each moving every channel its own way, then a rest — ScanlineAnimation's Glitch, by channel instead of by line",
        path: `${EXAMPLES_ROOT}/Glitch.vue`,
    },
    {
        key: "swell",
        name: EXAMPLE_NAMES.swell,
        readout: () => "red grows and blue shrinks about the middle, one slow swell per pass",
        path: `${EXAMPLES_ROOT}/Swell.vue`,
    },
    {
        key: "orbit",
        name: EXAMPLE_NAMES.orbit,
        readout: () =>
            "the three channels circle their resting place a third of a turn apart, swinging out and back over the pass, so a rainbow fringe turns around every edge",
        path: `${EXAMPLES_ROOT}/Orbit.vue`,
    },
    {
        key: "twist",
        name: EXAMPLE_NAMES.twist,
        readout: () =>
            "red turns one way and blue the other about the center, then back, so the fringes are thin in the middle and widest at the corners",
        path: `${EXAMPLES_ROOT}/Twist.vue`,
    },
    {
        key: "tilt",
        name: EXAMPLE_NAMES.tilt,
        readout: () =>
            "red and blue swing in depth in opposite directions, one way and then the other, so every edge splits into three like a card tilting under a light",
        path: `${EXAMPLES_ROOT}/Tilt.vue`,
    },
    {
        key: "anaglyph",
        name: EXAMPLE_NAMES.anaglyph,
        readout: () =>
            "red slides left and blue right while green holds, then they close up again, the red-and-cyan look of old 3D glasses",
        path: `${EXAMPLES_ROOT}/Anaglyph.vue`,
    },
    {
        key: "echo",
        name: EXAMPLE_NAMES.echo,
        readout: () =>
            "the whole picture drifts along a small figure-eight while green and then blue trail behind red, leaving a colored wake that catches up when the picture stops",
        path: `${EXAMPLES_ROOT}/Echo.vue`,
    },
    {
        key: "hueSwap",
        name: EXAMPLE_NAMES.hueSwap,
        readout: () =>
            "each pass holds one channel still — red, then green, then blue — and turns the other two round the color wheel in opposite directions until they land back where they began; the passes differ in strength, since a turned green stays bright while a turned red or blue dims",
        path: `${EXAMPLES_ROOT}/HueSwap.vue`,
    },
    {
        key: "focusPull",
        name: EXAMPLE_NAMES.focusPull,
        readout: () =>
            "each channel blurs and sharpens in turn, overlapping the next, like a lens hunting for focus with a colored halo",
        path: `${EXAMPLES_ROOT}/FocusPull.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="source"
            controls="Picks the example picture sent to RGBAnimationProps.src"
            label="Source"
            hint="The picture the channels are split from: the knight photograph, or a line of SVG text."
        >
            <PageSelectField
                :value="sourceKey"
                :values="SOURCE_KEYS"
                ariaLabel="Source"
                @change="(value: RGBAnimationSourceKey) => (sourceKey = value)"
            />
        </PageProp>

        <PageProp
            item-key="animationDurationMs"
            controls="Sets RGBAnimationProps.animationDurationMs"
            label="Animation duration (ms)"
            hint="How long one pass takes."
        >
            <PageNumberField
                :value="animationDurationMs"
                :min="RGBAnimationKnobs.MIN_DURATION_MS"
                :max="RGBAnimationKnobs.MAX_DURATION_MS"
                :step="RGBAnimationKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Animation duration"
                @input="(value: number) => (animationDurationMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="animationIterationDelayMs"
            controls="Sets RGBAnimationProps.animationIterationDelayMs"
            label="Iteration delay (ms)"
            hint="How long the picture waits between one pass and the next."
        >
            <PageNumberField
                :value="animationIterationDelayMs"
                :min="RGBAnimationKnobs.MIN_ITERATION_DELAY_MS"
                :max="RGBAnimationKnobs.MAX_ITERATION_DELAY_MS"
                :step="RGBAnimationKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Iteration delay"
                @input="(value: number) => (animationIterationDelayMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="colorMixing"
            controls="Sets RGBAnimationProps.colorMixing, with the color-scheme choice sent as undefined"
            label="Color mixing"
            hint="How the channels are put back together. Additive fringes are red, green and blue and read on a dark ground; subtractive ones are cyan, magenta and yellow and read on a light one. Left out, it follows the page's color-scheme at the start of each pass."
        >
            <PageSelectField
                :value="colorMixingChoice"
                :values="RGBAnimationKnobs.COLOR_MIXING_CHOICES"
                ariaLabel="Color mixing"
                @change="(value: ColorMixingChoice) => (colorMixingChoice = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #glitch>
            <GlitchExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="glitchPlayback"
                v-model:progress="glitchProgress"
            />
        </template>

        <template #swell>
            <SwellExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="swellPlayback"
                v-model:progress="swellProgress"
            />
        </template>

        <template #orbit>
            <OrbitExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="orbitPlayback"
                v-model:progress="orbitProgress"
            />
        </template>

        <template #twist>
            <TwistExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="twistPlayback"
                v-model:progress="twistProgress"
            />
        </template>

        <template #tilt>
            <TiltExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="tiltPlayback"
                v-model:progress="tiltProgress"
            />
        </template>

        <template #anaglyph>
            <AnaglyphExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="anaglyphPlayback"
                v-model:progress="anaglyphProgress"
            />
        </template>

        <template #echo>
            <EchoExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="echoPlayback"
                v-model:progress="echoProgress"
            />
        </template>

        <template #hueSwap>
            <HueSwapExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="hueSwapPlayback"
                v-model:progress="hueSwapProgress"
            />
        </template>

        <template #focusPull>
            <FocusPullExampleWrapper
                v-bind="commonProps"
                :box-width="boxWidth"
                v-model:playback="focusPullPlayback"
                v-model:progress="focusPullProgress"
            />
        </template>
    </PageExamples>
</template>
