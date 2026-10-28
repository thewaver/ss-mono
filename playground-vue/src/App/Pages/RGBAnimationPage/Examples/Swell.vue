<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation } from "@thewaver/ss-components-vue";
import type { RGBAnimationChannel, RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

const SCALE_DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

const computeSwell = (timeline: number) => (1 - Math.cos(timeline * 2 * Math.PI)) * 0.5;

type Props = RGBAnimationExampleProps & { scalePercent: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeChannelAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => {
    const scale = 100 + SCALE_DIRECTIONS[defs.channel] * props.scalePercent * computeSwell(timeline);

    return { scale: [scale, scale] };
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
        :compute-channel-animation="computeChannelAnimation"
    />
</template>
