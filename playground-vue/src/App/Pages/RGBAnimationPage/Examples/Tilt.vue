<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation } from "@thewaver/ss-components-vue";
import type { RGBAnimationChannel, RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

const DIRECTIONS: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };
const PERSPECTIVE_PX = 600;

type Props = RGBAnimationExampleProps & { maxDegrees: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeChannelAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => ({
    perspective: PERSPECTIVE_PX,
    rotateY: DIRECTIONS[defs.channel] * props.maxDegrees * Math.sin(timeline * 2 * Math.PI),
});
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
