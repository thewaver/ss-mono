<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";
import type { RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

const WINDOW_SHARE = 0.5;
const STAGGER_SHARE = 0.25;

const computeBump = (share: number) => (share <= 0 || share >= 1 ? 0 : (1 - Math.cos(share * 2 * Math.PI)) * 0.5);

type Props = RGBAnimationExampleProps & { maxBlurPx: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeSliceAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => {
    const index = RGB_ANIMATION_CHANNELS.indexOf(defs.channel);
    const share = (timeline - index * STAGGER_SHARE) / WINDOW_SHARE;

    return { blur: props.maxBlurPx * computeBump(share) };
};
</script>

<template>
    <RGBAnimation
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :aria-label="ariaLabel"
        :color-mixing="colorMixing"
        :animation-duration-ms="animationDurationMs"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :compute-slice-animation="computeSliceAnimation"
    />
</template>
