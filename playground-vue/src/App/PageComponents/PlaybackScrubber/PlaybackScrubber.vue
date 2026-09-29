<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, ElementObserverVueUtils, Range } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const PERCENT = 100;
const SLIDER_STEP = 1;
const PLAY_ICON_PATH = "M7 4 L20 12 L7 20 Z";
const PAUSE_ICON_PATH = "M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z";

const props = defineProps<PagePlaybackScrubberProps>();

const sliderSlotRef = shallowRef<HTMLDivElement>();

const sliderSlotSize = ElementObserverVueUtils.useBorderBoxSize(sliderSlotRef);

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
                <PageButtonContent :flags="flags">
                    <svg :class="styles.playbackIcon" viewBox="0 0 24 24" aria-hidden="true">
                        <path :d="isPlaying ? PAUSE_ICON_PATH : PLAY_ICON_PATH" />
                    </svg>
                </PageButtonContent>
            </template>
        </Button>

        <div ref="sliderSlotRef" :class="styles.sliderSlot">
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
                    <PageRangeContent :render-props="renderProps" :length="sliderSlotSize.width" />
                </template>
            </Range>
        </div>
    </div>
</template>
