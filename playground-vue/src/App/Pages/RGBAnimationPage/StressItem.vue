<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-vue";
import type { SliceAnimationFn, SliceAnimationRenderer } from "@thewaver/ss-components-vue";
import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
import {
    STRESS_ITEM_WIDTH,
    STRESS_ITERATION_DELAY_MS,
} from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";
import type { CSSAnimationValues } from "@thewaver/ss-utils";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";

const STRESS_SAMPLES: (() => {
    animation: SliceAnimationFn;
    computeRootAnimation?: (timeline: number) => CSSAnimationValues;
})[] = [
    () => ({
        animation: RGBAnimationKeyframes.createSwell({ scalePercent: RGBAnimationKnobs.STARTING_SCALE_PERCENT }),
    }),
    () => ({
        animation: RGBAnimationKeyframes.createOrbit({
            radiusPercent: RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT,
        }),
    }),
    () => ({
        animation: RGBAnimationKeyframes.createFocusPull({ maxBlurPx: RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX }),
    }),
    () => ({ animation: RGBAnimationKeyframes.createTwist({ maxDegrees: RGBAnimationKnobs.STARTING_TWIST_DEGREES }) }),
    () => ({
        animation: RGBAnimationKeyframes.createHueSwap({ turns: RGBAnimationKnobs.STARTING_HUE_TURNS, anchor: "red" }),
    }),
    () => ({ animation: RGBAnimationKeyframes.createTilt({ maxDegrees: RGBAnimationKnobs.STARTING_TILT_DEGREES }) }),
    () => ({
        animation: RGBAnimationKeyframes.createAnaglyph({
            separationPercent: RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT,
        }),
    }),
    () => {
        const opts = { distancePercent: RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT };

        return {
            animation: RGBAnimationKeyframes.createEcho(opts),
            computeRootAnimation: (timeline) => ({
                translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts),
            }),
        };
    },
];

type Props = BaseRGBAnimationExampleProps & {
    "modalPlayback": boolean;
    "onUpdate:modalPlayback"?: (isPlaying: boolean) => void;
    "renderer": SliceAnimationRenderer;
};

const props = defineProps<Props>();

const modalPlayback = useModel(props, "modalPlayback");

const sample = STRESS_SAMPLES[Math.floor(Math.random() * STRESS_SAMPLES.length)]();
</script>

<template>
    <PageMeasureBox :width="STRESS_ITEM_WIDTH">
        <RGBAnimation
            v-model:playback="modalPlayback"
            :src="src"
            :color-mixing="colorMixing"
            :animation-duration-ms="animationDurationMs"
            :animation-iteration-delay-ms="STRESS_ITERATION_DELAY_MS"
            :renderer="renderer"
            :compute-root-animation="sample.computeRootAnimation"
            :compute-slice-animation="sample.animation"
        />
    </PageMeasureBox>
</template>
