<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useModel } from "vue";

import { Timeline } from "@thewaver/ss-components-vue";
import type { Meeting } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    DAY,
    LANE_SIZE,
    MEETINGS,
    MINUTE_STEPS,
    formatClock,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import { AXIS_HEIGHT } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import PageTimelineBlock from "../../../StyledComponents/TimelineContent/PageTimelineBlock.vue";
import PageTimelineFrame from "../../../StyledComponents/TimelineContent/PageTimelineFrame.vue";
import PageTimelineMarker from "../../../StyledComponents/TimelineContent/PageTimelineMarker.vue";
import PageTimelineTick from "../../../StyledComponents/TimelineContent/PageTimelineTick.vue";
import PageTimelineTrack from "../../../StyledComponents/TimelineContent/PageTimelineTrack.vue";
import type { TimelineExampleProps } from "../TimelinePage.types";

type Props = TimelineExampleProps;

const MINUTES_PER_HOUR = 60;
const NOW_REFRESH_MS = 30000;

const getMinutesNow = () => {
    const now = new Date();

    return now.getHours() * MINUTES_PER_HOUR + now.getMinutes();
};

const computeSpan = (meeting: Meeting) => ({ start: meeting.from, end: meeting.to });

const computeIsItemDisabled = (meeting: Meeting) => meeting.isCanceled === true;

const computeItemAriaLabel = (meeting: Meeting) =>
    `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`;

const props = defineProps<Props>();

const view = useModel(props, "view");

const now = shallowRef(getMinutesNow());

let timerId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    timerId = setInterval(() => {
        now.value = getMinutesNow();
    }, NOW_REFRESH_MS);
});

onBeforeUnmount(() => {
    clearInterval(timerId);
});
</script>

<template>
    <PageTimelineFrame>
        <PageTimelineTrack>
            <Timeline
                v-model:view="view"
                :range="DAY"
                :items="MEETINGS"
                :lane-size="LANE_SIZE"
                :axis-size="AXIS_HEIGHT"
                :tick-steps="MINUTE_STEPS"
                :is-pannable="isPannable"
                :is-zoomable="isZoomable"
                :is-disabled="isDisabled"
                :markers="[now]"
                ariaLabel="Today's meetings"
                :compute-span="computeSpan"
                :compute-is-item-disabled="computeIsItemDisabled"
                :compute-item-aria-label="computeItemAriaLabel"
                @item-activate="(meeting: Meeting) => props.onPick(meeting.name)"
            >
                <template #renderTick="tick">
                    <PageTimelineTick :tick="tick" :label="formatClock(tick.value)" />
                </template>

                <template #renderMarker="{ marker }">
                    <PageTimelineMarker :marker="marker" tone="now" />
                </template>

                <template #renderItem="{ item, flags }">
                    <PageTimelineBlock
                        :flags="flags"
                        tone="info"
                        :name="item.name"
                        :note="`${formatClock(item.from)} · ${item.room}`"
                    />
                </template>
            </Timeline>
        </PageTimelineTrack>
    </PageTimelineFrame>
</template>
