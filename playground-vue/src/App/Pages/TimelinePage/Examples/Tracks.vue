<script setup lang="ts">
import { shallowRef, useModel, watch } from "vue";

import { Button, Timeline } from "@thewaver/ss-components-vue";
import type { TimelineController } from "@thewaver/ss-components-vue";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    CLIPS,
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import {
    AXIS_HEIGHT,
    PAGE_TIMELINE_FAMILIES,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTimelineBlock from "../../../StyledComponents/TimelineContent/PageTimelineBlock.vue";
import PageTimelineControls from "../../../StyledComponents/TimelineContent/PageTimelineControls.vue";
import PageTimelineFrame from "../../../StyledComponents/TimelineContent/PageTimelineFrame.vue";
import PageTimelineLanes from "../../../StyledComponents/TimelineContent/PageTimelineLanes.vue";
import PageTimelineMarker from "../../../StyledComponents/TimelineContent/PageTimelineMarker.vue";
import PageTimelineRow from "../../../StyledComponents/TimelineContent/PageTimelineRow.vue";
import PageTimelineTick from "../../../StyledComponents/TimelineContent/PageTimelineTick.vue";
import PageTimelineTrack from "../../../StyledComponents/TimelineContent/PageTimelineTrack.vue";
import type { TimelineExampleProps } from "../TimelinePage.types";

type Props = TimelineExampleProps;

const LANE_GAP = 6;
const ZOOM_IN = 0.6;
const ZOOM_OUT = 1 / ZOOM_IN;
const PAN_STEP = 0.4;
const MS_PER_SECOND = 1000;

const computeSpan = (clip: Clip) => ({ start: clip.from, end: clip.to });

const computeLane = (clip: Clip) => clip.track;

const computeItemAriaLabel = (clip: Clip) =>
    `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`;

const props = defineProps<Props>();

const view = useModel(props, "view");

const controller = shallowRef<TimelineController>();

const playhead = shallowRef(REEL.start);
const isPlaying = shallowRef(false);

watch(isPlaying, (isNowPlaying, _, onCleanup) => {
    if (!isNowPlaying) return;

    let frameId: number | undefined;
    let lastMs = performance.now();

    const advance = () => {
        const nowMs = performance.now();
        const next = playhead.value + (nowMs - lastMs) / MS_PER_SECOND;

        lastMs = nowMs;

        if (next >= REEL.end) {
            playhead.value = REEL.end;
            isPlaying.value = false;

            return;
        }

        playhead.value = next;
        frameId = requestAnimationFrame(advance);
    };

    frameId = requestAnimationFrame(advance);

    onCleanup(() => {
        if (frameId !== undefined) cancelAnimationFrame(frameId);
    });
});

const setController = (next: TimelineController) => {
    controller.value = next;
};

const play = () => {
    if (playhead.value >= REEL.end) playhead.value = REEL.start;

    isPlaying.value = true;
};

const pause = () => {
    isPlaying.value = false;
};

const panBy = (ratio: number) => {
    controller.value?.panBy(ratio);
};

const zoomBy = (factor: number) => {
    controller.value?.zoomBy(factor);
};

const showWholeReel = async () => {
    view.value = REEL;
};
</script>

<template>
    <PageTimelineFrame>
        <PageTimelineRow>
            <PageTimelineLanes :names="TRACKS" :lane-size="LANE_SIZE" :lane-gap="LANE_GAP" />

            <PageTimelineTrack>
                <Timeline
                    v-model:view="view"
                    :range="REEL"
                    :items="CLIPS"
                    :lane-size="LANE_SIZE"
                    :axis-size="AXIS_HEIGHT"
                    :lane-gap="LANE_GAP"
                    :lane-count="TRACKS.length"
                    :tick-steps="SECOND_STEPS"
                    :is-pannable="isPannable"
                    :is-zoomable="isZoomable"
                    :is-disabled="isDisabled"
                    :markers="[playhead]"
                    ariaLabel="Cut of the episode"
                    :compute-span="computeSpan"
                    :compute-lane="computeLane"
                    :compute-item-aria-label="computeItemAriaLabel"
                    @item-activate="(clip: Clip) => props.onPick(clip.name)"
                    @mount="setController"
                >
                    <template #renderTick="tick">
                        <PageTimelineTick :tick="tick" :label="formatStopwatch(tick.value)" />
                    </template>

                    <template #renderMarker="{ marker }">
                        <PageTimelineMarker :marker="marker" tone="playhead" />
                    </template>

                    <template #renderItem="{ item, flags }">
                        <PageTimelineBlock
                            :flags="flags"
                            :family="PAGE_TIMELINE_FAMILIES[item.track % PAGE_TIMELINE_FAMILIES.length]"
                            :name="item.name"
                            :note="formatStopwatch(item.to - item.from)"
                        />
                    </template>
                </Timeline>
            </PageTimelineTrack>
        </PageTimelineRow>

        <PageTimelineControls>
            <Button id="tracksPlay" @click="play">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Play</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksPause" @click="pause">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Pause</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksEarlier" :is-disabled="isDisabled" @click="panBy(-PAN_STEP)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Earlier</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksLater" :is-disabled="isDisabled" @click="panBy(PAN_STEP)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Later</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksZoomIn" :is-disabled="isDisabled" @click="zoomBy(ZOOM_IN)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Zoom in</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksZoomOut" :is-disabled="isDisabled" @click="zoomBy(ZOOM_OUT)">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Zoom out</PageButtonContent>
                </template>
            </Button>

            <Button id="tracksWholeReel" :is-disabled="isDisabled" @click="showWholeReel">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Whole reel</PageButtonContent>
                </template>
            </Button>
        </PageTimelineControls>
    </PageTimelineFrame>
</template>
