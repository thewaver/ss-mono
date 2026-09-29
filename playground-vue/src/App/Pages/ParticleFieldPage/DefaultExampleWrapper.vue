<script setup lang="ts">
import { computed, useModel } from "vue";

import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import DefaultExample from "./Examples/Default.vue";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

const BOX_WIDTH = 320;
const BOX_HEIGHT = 320;

type Props = Omit<ParticleFieldExampleProps, "playback" | "onUpdate:playback"> & {
    "progress": number;
    "onUpdate:progress"?: (value: number) => void;
    "ownPlayback": boolean;
    "onUpdate:ownPlayback"?: (value: boolean) => void;
};

const props = defineProps<Props>();

const progress = useModel(props, "progress");
const ownPlayback = useModel(props, "ownPlayback");

const fieldProps = computed(() => ({
    cellCount: props.cellCount,
    spawnChance: props.spawnChance,
    animationIterationDelayMs: props.animationIterationDelayMs,
    animationDurationMs: props.animationDurationMs,
    particleLifetimeMs: props.particleLifetimeMs,
    originType: props.originType,
    weightType: props.weightType,
    animationType: props.animationType,
    holdShare: props.holdShare,
    isScattered: props.isScattered,
}));
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
            <DefaultExample v-bind="fieldProps" v-model:playback="ownPlayback" v-model:progress="progress" />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="particleField"
            v-model:playback="ownPlayback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>
</template>
