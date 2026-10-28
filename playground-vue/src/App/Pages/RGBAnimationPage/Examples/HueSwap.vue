<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";
import type { RGBAnimationChannel, RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

const FULL_TURN_DEGREES = 360;

const computeDirection = (channel: RGBAnimationChannel, anchor: RGBAnimationChannel) => {
    if (channel === anchor) return 0;

    return RGB_ANIMATION_CHANNELS.find((other) => other !== anchor) === channel ? 1 : -1;
};

type Props = RGBAnimationExampleProps & { turns: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const pass = shallowRef(0);

const nextPass = () => {
    pass.value += 1;
};

const computeChannelAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => ({
    "hue-rotate":
        computeDirection(defs.channel, RGB_ANIMATION_CHANNELS[pass.value % RGB_ANIMATION_CHANNELS.length]) *
        props.turns *
        FULL_TURN_DEGREES *
        timeline,
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
        @iteration-end="nextPass"
    />
</template>
