<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { RGBAnimation, RGBAnimationKeyframes, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

type Props = RGBAnimationExampleProps & { turns: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const pass = shallowRef(0);

const nextPass = () => {
    pass.value += 1;
};

const animation = computed(() =>
    RGBAnimationKeyframes.createHueSwap({
        turns: props.turns,
        anchor: RGB_ANIMATION_CHANNELS[pass.value % RGB_ANIMATION_CHANNELS.length],
    }),
);
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
        :compute-slice-animation="animation"
        @iteration-end="nextPass"
    />
</template>
