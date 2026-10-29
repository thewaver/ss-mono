<script setup lang="ts">
import { computed, useModel } from "vue";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

type Props = RGBAnimationExampleProps & { distancePercent: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const opts = computed(() => ({ distancePercent: props.distancePercent }));

const animation = computed(() => RGBAnimationKeyframes.createEcho(opts.value));

const computeRootAnimation = (timeline: number) => ({
    translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts.value),
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
        :compute-root-animation="computeRootAnimation"
        :compute-slice-animation="animation"
    />
</template>
