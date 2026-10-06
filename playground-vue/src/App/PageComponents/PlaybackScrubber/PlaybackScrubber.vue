<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, ElementObserverVueUtils, Range } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const PERCENT = 100;
const SLIDER_STEP = 1;

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
                <PageControlButtonContent
                    :flags="flags"
                    :glyph="isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play"
                />
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
