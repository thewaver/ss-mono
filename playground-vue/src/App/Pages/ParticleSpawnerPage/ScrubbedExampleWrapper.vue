<script setup lang="ts">
import { type Ref, computed, shallowRef, useModel } from "vue";

import {
    BOX_HEIGHT,
    BOX_WIDTH,
} from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";

const props = defineProps<{
    "id": string;
    "isPagePlaying": boolean;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
}>();

const playback = useModel(props, "playback");

const progress = shallowRef(0);
const followers: Ref<number>[] = [];

const takeProgress = () => {
    const follower = shallowRef(progress.value);

    followers.push(follower);

    return follower;
};

const scrubbedProgress = computed({
    get: () => progress.value,
    set: (value) => {
        progress.value = value;

        for (const follower of followers) follower.value = value;
    },
});

const examplePlayback = computed({
    get: () => props.isPagePlaying && playback.value,
    set: (value) => {
        playback.value = value;
    },
});

const slotProps = { playback: examplePlayback, progress, takeProgress };
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="BOX_WIDTH" :height="BOX_HEIGHT">
            <slot v-bind="slotProps" />
        </PageMeasureBox>

        <PagePlaybackScrubber
            :id="id"
            v-model:playback="playback"
            v-model:progress="scrubbedProgress"
            ariaLabel="Position in the round"
        />
    </div>
</template>
