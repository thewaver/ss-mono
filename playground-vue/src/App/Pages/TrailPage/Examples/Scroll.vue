<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { ElementObserverVueUtils, Trail } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageTrailMarker from "../../../StyledComponents/TrailContent/PageTrailMarker.vue";
import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.vue";
import type { TrailScrollExampleProps } from "../TrailPage.types";

const SCROLL_SIZE = { width: 320, height: styles.SCROLL_BOX_HEIGHT };
const SCROLL_PATH = "M 24 70 C 70 10, 110 10, 160 70 S 250 130, 296 70";
const MARKER_ID = "scrollMarker";

type Props = TrailScrollExampleProps;

const props = defineProps<Props>();

const boxRef = shallowRef<HTMLDivElement>();
const runwayRef = shallowRef<HTMLDivElement>();

const progress = ElementObserverVueUtils.useScrollContainerProgress(runwayRef, boxRef, () => !props.isFollowing);

watch(progress, (next) => props.onProgressChange(next), { immediate: true });
</script>

<template>
    <div id="trailScrollBox" ref="boxRef" :class="styles.scrollBox">
        <div :class="styles.scrollPinned">
            <PageMeasureBox>
                <Trail
                    :path="SCROLL_PATH"
                    :size="SCROLL_SIZE"
                    :duration-ms="durationMs"
                    :is-looping="isLooping"
                    :is-turning="isTurning"
                    :progress="progress"
                    :playback="false"
                >
                    <template #renderTrack="path">
                        <PageTrailTrack :path="path" />
                    </template>

                    <template #renderTraveler>
                        <PageTrailMarker :id="MARKER_ID" />
                    </template>
                </Trail>
            </PageMeasureBox>
        </div>

        <div ref="runwayRef" :class="styles.scrollRunway" />
    </div>
</template>
