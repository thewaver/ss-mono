<script setup lang="ts">
import { useModel } from "vue";

import { Timeline } from "@thewaver/ss-components-vue";
import type { TimelineEdgeAnnouncements, TimelineSpan } from "@thewaver/ss-components-vue";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRIM_TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import { AXIS_HEIGHT } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import PageTimelineBlock from "../../../StyledComponents/TimelineContent/PageTimelineBlock.vue";
import PageTimelineFrame from "../../../StyledComponents/TimelineContent/PageTimelineFrame.vue";
import PageTimelineLanes from "../../../StyledComponents/TimelineContent/PageTimelineLanes.vue";
import PageTimelineRow from "../../../StyledComponents/TimelineContent/PageTimelineRow.vue";
import PageTimelineTick from "../../../StyledComponents/TimelineContent/PageTimelineTick.vue";
import PageTimelineTrack from "../../../StyledComponents/TimelineContent/PageTimelineTrack.vue";
import type { TimelineTrimExampleProps } from "../TimelinePage.types";

type Props = TimelineTrimExampleProps;

const LANE_GAP = 6;
const TONES = ["info", "alert"] as const;

const EDGE_ANNOUNCEMENTS: TimelineEdgeAnnouncements = {
    restingKeyHint: "Press Enter to take hold of the end of this clip.",
    heldKeyHint:
        "Left and right arrows move it a second at a time, Home and End switch between the start and the end, Enter drops it and Escape puts it back.",
    computePlaceLabel: (edge, span) =>
        `${edge} at ${formatStopwatch(span[edge])}, ${formatStopwatch(span.end - span.start)} long`,
    computePickedUp: (itemLabel) => `Holding an end of ${itemLabel}.`,
    computePickedUpByKey: (itemLabel, _zoneLabel, placeLabel, keyHint) =>
        `Holding ${itemLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel) => `${placeLabel.charAt(0).toUpperCase()}${placeLabel.slice(1)}.`,
    computeZoneEntered: (_zoneLabel, placeLabel) => placeLabel,
    computeReturned: (itemLabel) => `${itemLabel} put back as it was.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left as it was.`,
    computeRefused: (itemLabel) => `${itemLabel} put back as it was.`,
    computeDropped: (_itemLabel, _zoneLabel, placeLabel) => `Dropped, ${placeLabel}.`,
};

const computeSpan = (clip: Clip) => ({ start: clip.from, end: clip.to });

const computeLane = (clip: Clip) => clip.track;

const computeSnapValue = (value: number) => Math.round(value);

const computeItemAriaLabel = (clip: Clip) =>
    `${clip.name}, ${TRIM_TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`;

const props = defineProps<Props>();

const view = useModel(props, "view");
const clips = useModel(props, "clips");

const trim = (clip: Clip, index: number, span: TimelineSpan) => {
    const trimmed = { ...clip, from: span.start, to: span.end };

    clips.value = clips.value.map((entry, at) => (at === index ? trimmed : entry));
    props.onTrim(trimmed);
};
</script>

<template>
    <PageTimelineFrame>
        <PageTimelineRow>
            <PageTimelineLanes :names="TRIM_TRACKS" :lane-size="LANE_SIZE" :lane-gap="LANE_GAP" />

            <PageTimelineTrack>
                <Timeline
                    v-model:view="view"
                    :range="REEL"
                    :items="clips"
                    :lane-size="LANE_SIZE"
                    :axis-size="AXIS_HEIGHT"
                    :lane-gap="LANE_GAP"
                    :lane-count="TRIM_TRACKS.length"
                    :tick-steps="SECOND_STEPS"
                    :is-pannable="isPannable"
                    :is-zoomable="isZoomable"
                    :is-disabled="isDisabled"
                    :edge-announcements="EDGE_ANNOUNCEMENTS"
                    ariaLabel="Clips to trim"
                    :compute-span="computeSpan"
                    :compute-lane="computeLane"
                    :compute-snap-value="computeSnapValue"
                    :compute-item-aria-label="computeItemAriaLabel"
                    @item-activate="(clip: Clip) => props.onPick(clip.name)"
                    @span-change="trim"
                >
                    <template #renderTick="tick">
                        <PageTimelineTick :tick="tick" :label="formatStopwatch(tick.value)" />
                    </template>

                    <template #renderItem="{ item, flags }">
                        <PageTimelineBlock
                            :flags="flags"
                            :tone="TONES[item.track % TONES.length]"
                            :name="item.name"
                            :note="formatStopwatch(flags.span.end - flags.span.start)"
                        />
                    </template>
                </Timeline>
            </PageTimelineTrack>
        </PageTimelineRow>
    </PageTimelineFrame>
</template>
