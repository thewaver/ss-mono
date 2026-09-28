import { Timeline } from "@thewaver/ss-components-react";
import type { TimelineEdgeAnnouncements } from "@thewaver/ss-components-react";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRIM_TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import { AXIS_HEIGHT } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import {
    PageTimelineBlock,
    PageTimelineFrame,
    PageTimelineLanes,
    PageTimelineRow,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
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

export const TrimExample = (props: Props) => {
    const [clips, setClips] = props.clipsState;

    return (
        <PageTimelineFrame>
            <PageTimelineRow>
                <PageTimelineLanes names={TRIM_TRACKS} laneSize={LANE_SIZE} laneGap={LANE_GAP} />

                <PageTimelineTrack>
                    <Timeline<Clip>
                        range={REEL}
                        items={clips}
                        laneSize={LANE_SIZE}
                        axisSize={AXIS_HEIGHT}
                        laneGap={LANE_GAP}
                        laneCount={TRIM_TRACKS.length}
                        tickSteps={SECOND_STEPS}
                        isPannable={props.isPannable}
                        isZoomable={props.isZoomable}
                        isDisabled={props.isDisabled}
                        viewState={props.viewState}
                        edgeAnnouncements={EDGE_ANNOUNCEMENTS}
                        ariaLabel={"Clips to trim"}
                        computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                        computeLane={(clip) => clip.track}
                        computeSnapValue={(value) => Math.round(value)}
                        computeItemAriaLabel={(clip) =>
                            `${clip.name}, ${TRIM_TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                        }
                        renderTick={(tick) => <PageTimelineTick tick={tick} label={formatStopwatch(tick.value)} />}
                        renderItem={(clip, flags) => (
                            <PageTimelineBlock
                                flags={flags}
                                tone={TONES[clip.track % TONES.length]}
                                name={clip.name}
                                note={formatStopwatch(flags.span.end - flags.span.start)}
                            />
                        )}
                        onItemActivate={(clip) => props.onPick(clip.name)}
                        onSpanChange={(clip, index, span) => {
                            const trimmed = { ...clip, from: span.start, to: span.end };

                            setClips((previous) => previous.map((entry, at) => (at === index ? trimmed : entry)));
                            props.onTrim(trimmed);
                        }}
                    />
                </PageTimelineTrack>
            </PageTimelineRow>
        </PageTimelineFrame>
    );
};
