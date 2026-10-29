<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";
import type { RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

type Props = RGBAnimationExampleProps & { radiusPercent: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeSliceAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => {
    const index = RGB_ANIMATION_CHANNELS.indexOf(defs.channel);
    const angle = (timeline + index / RGB_ANIMATION_CHANNELS.length) * 2 * Math.PI;
    const radius = props.radiusPercent * Math.sin(timeline * Math.PI);

    return { translate: [radius * Math.cos(angle), radius * Math.sin(angle)] };
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
