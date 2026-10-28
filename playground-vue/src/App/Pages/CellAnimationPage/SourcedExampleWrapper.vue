<script setup lang="ts">
import { computed, useModel } from "vue";

import { IMAGE_CONTAINER_SIZE } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";

import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.vue";
import type { CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import DefaultExample from "./Examples/Default.vue";

type Props = CellAnimationSourcedExampleProps & {
    "progress": number;
    "onUpdate:progress"?: (progress: number) => void;
    "isPagePlaying": boolean;
    "computeWidth": (longestSide: number) => number;
};

const props = defineProps<Props>();

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const sharedProps = computed(() => {
    const {
        "playback": _playback,
        "onUpdate:playback": _setPlayback,
        "progress": _progress,
        "onUpdate:progress": _setProgress,
        "isPagePlaying": _isPagePlaying,
        "computeWidth": _computeWidth,
        ...shared
    } = props;

    return shared;
});
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox :width="computeWidth(IMAGE_CONTAINER_SIZE)">
            <DefaultExample
                v-bind="sharedProps"
                v-model:progress="progress"
                :playback="isPagePlaying && playback"
                @update:playback="(next: boolean) => (playback = next)"
            />
        </PageMeasureBox>

        <PagePlaybackScrubber
            id="cellAnimation"
            v-model:playback="playback"
            v-model:progress="progress"
            ariaLabel="Position in the pass"
        />
    </div>
</template>
