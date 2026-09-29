<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Range, Trail } from "@thewaver/ss-components-vue";
import type { TrailController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import PageTrailMarker from "../../../StyledComponents/TrailContent/PageTrailMarker.vue";
import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.vue";
import type { TrailExampleProps } from "../TrailPage.types";

const TIMELINE_SIZE = { width: 320, height: 140 };
const TIMELINE_PATH = "M 24 108 C 92 12, 168 154, 232 74 S 296 26, 304 58";
const PERCENT = 100;
const SLIDER_STEP = 1;
const MARKER_ID = "timelineMarker";

type Props = TrailExampleProps;

const props = defineProps<Props>();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const controller = shallowRef<TrailController>();

const setController = (next: TrailController) => {
    controller.value = next;
};

const seek = (value: number) => {
    controller.value?.seek(value / PERCENT);
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox>
            <Trail
                v-model:progress="progress"
                v-model:playback="playback"
                :path="TIMELINE_PATH"
                :size="TIMELINE_SIZE"
                :duration-ms="durationMs"
                :is-looping="isLooping"
                :is-turning="isTurning"
                @mount="setController"
            >
                <template #renderTrack="path">
                    <PageTrailTrack :path="path" />
                </template>

                <template #renderTraveler>
                    <PageTrailMarker :id="MARKER_ID" />
                </template>
            </Trail>
        </PageMeasureBox>

        <div :class="styles.slider">
            <Range
                id="timelineScrubber"
                sizing="fill"
                ariaLabel="Position along the path"
                :min="0"
                :max="PERCENT"
                :step="SLIDER_STEP"
                :value="Math.round(progress * PERCENT)"
                @update:value="seek"
            >
                <template #renderContent="renderProps">
                    <PageRangeContent :render-props="renderProps" :length="TIMELINE_SIZE.width" />
                </template>
            </Range>
        </div>
    </div>
</template>
