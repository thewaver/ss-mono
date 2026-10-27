<script setup lang="ts">
import { useModel } from "vue";

import { Button, Range } from "@thewaver/ss-components-vue";
import {
    PERCENT,
    SLIDER_STEP,
} from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const props = defineProps<PagePlaybackScrubberProps>();

const isPlaying = useModel(props, "playback");
const progress = useModel(props, "progress");

const togglePlayback = () => {
    isPlaying.value = !isPlaying.value;
};

const setProgress = (value: number) => {
    progress.value = value / PERCENT;
};
</script>

<template>
    <div :class="styles.playbackRow">
        <Button :id="`${id}Playback`" :ariaLabel="isPlaying ? 'Pause' : 'Play'" @click="togglePlayback">
            <template #renderContent="flags">
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
            </template>
        </Button>

        <div :class="styles.sliderSlot">
            <Range
                :id="`${id}Progress`"
                sizing="fill"
                :ariaLabel="ariaLabel"
                :min="0"
                :max="PERCENT"
                :step="SLIDER_STEP"
                :value="Math.round(progress * PERCENT)"
                @update:value="setProgress"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" />
                </template>
            </Range>
        </div>
    </div>
</template>
