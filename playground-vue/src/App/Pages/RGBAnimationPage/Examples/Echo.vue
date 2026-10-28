<script setup lang="ts">
import { useModel } from "vue";

import { RGBAnimation, RGB_ANIMATION_CHANNELS } from "@thewaver/ss-components-vue";
import type { RGBAnimationEvaluationDefs } from "@thewaver/ss-components-vue";

import type { RGBAnimationExampleProps } from "../RGBAnimationPageVue.types";

const LAG_SHARE = 0.1;
const TRAVEL_SHARE = 1 - LAG_SHARE * (RGB_ANIMATION_CHANNELS.length - 1);

const computePath = (timeline: number, distance: number) => {
    if (timeline <= 0 || timeline >= TRAVEL_SHARE) return [0, 0];

    const turn = (timeline / TRAVEL_SHARE) * 2 * Math.PI;

    return [distance * Math.sin(turn), distance * Math.sin(turn * 2) * 0.5];
};

type Props = RGBAnimationExampleProps & { distancePercent: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeRootAnimation = (timeline: number) => ({ translate: computePath(timeline, props.distancePercent) });

const computeChannelAnimation = (defs: RGBAnimationEvaluationDefs, timeline: number) => {
    const lag = RGB_ANIMATION_CHANNELS.indexOf(defs.channel) * LAG_SHARE;
    const [rootX, rootY] = computePath(timeline, props.distancePercent);
    const [laggedX, laggedY] = computePath(timeline - lag, props.distancePercent);

    return { translate: [laggedX - rootX, laggedY - rootY] };
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
        :compute-root-animation="computeRootAnimation"
        :compute-channel-animation="computeChannelAnimation"
    />
</template>
