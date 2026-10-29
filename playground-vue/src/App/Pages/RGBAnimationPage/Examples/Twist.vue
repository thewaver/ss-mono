<script setup lang="ts">
import { computed, useModel } from "vue";

import { RGBAnimation, RGBAnimationKeyframes } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

type Props = RGBAnimationExampleProps & { maxDegrees: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const animation = computed(() => RGBAnimationKeyframes.createTwist({ maxDegrees: props.maxDegrees }));
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
    />
</template>
