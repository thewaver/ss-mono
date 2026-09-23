import { Timeline, accessSignal } from "@thewaver/ss-components";
import type { TimelineEdgeAnnouncements } from "@thewaver/ss-components";

import {
    PageTimelineBlock,
    PageTimelineFrame,
    PageTimelineLanes,
    PageTimelineRow,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
import { LANE_SIZE, REEL, SECOND_STEPS, TRIM_TRACKS, formatStopwatch } from "../TimelinePage.const";
import type { Clip, TimelineTrimExampleProps } from "../TimelinePage.types";

import { AXIS_HEIGHT } from "../../../StyledComponents/TimelineContent/TimelineContent.css";

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

export const TrimExample = (props: Props) => {
    const clipsSignal = accessSignal(() => props.clipsSignal);

    return (
        <PageTimelineFrame>
            <PageTimelineRow>
                <PageTimelineLanes names={() => TRIM_TRACKS} laneSize={() => LANE_SIZE} laneGap={() => LANE_GAP} />

                <PageTimelineTrack>
                    <Timeline<Clip>
                        range={() => REEL}
                        items={clipsSignal[0]}
                        laneSize={() => LANE_SIZE}
                        axisSize={() => AXIS_HEIGHT}
                        laneGap={() => LANE_GAP}
                        laneCount={() => TRIM_TRACKS.length}
                        tickSteps={() => SECOND_STEPS}
                        isPannable={props.isPannable}
                        isZoomable={props.isZoomable}
                        isDisabled={props.isDisabled}
                        viewSignal={props.viewSignal}
                        edgeAnnouncements={() => EDGE_ANNOUNCEMENTS}
                        ariaLabel={"Clips to trim"}
                        computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                        computeLane={(clip) => clip.track}
                        computeSnapValue={(value) => Math.round(value)}
                        computeItemAriaLabel={(clip) =>
                            `${clip.name}, ${TRIM_TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                        }
                        renderTick={(getTick) => (
                            <PageTimelineTick tick={getTick} label={() => formatStopwatch(getTick().value)} />
                        )}
                        renderItem={(getClip, getFlags) => (
                            <PageTimelineBlock
                                flags={getFlags}
                                tone={() => TONES[getClip().track % TONES.length]}
                                name={() => getClip().name}
                                note={() => formatStopwatch(getFlags().span.end - getFlags().span.start)}
                            />
                        )}
                        onItemActivate={(clip) => props.onPick(clip.name)}
                        onSpanChange={(clip, index, span) => {
                            const trimmed = { ...clip, from: span.start, to: span.end };

                            clipsSignal[1]((clips) => clips.map((entry, at) => (at === index ? trimmed : entry)));
                            props.onTrim(trimmed);
                        }}
                    />
                </PageTimelineTrack>
            </PageTimelineRow>
        </PageTimelineFrame>
    );
};
