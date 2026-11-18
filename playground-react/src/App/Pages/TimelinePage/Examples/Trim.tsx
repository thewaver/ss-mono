import { Timeline } from "@thewaver/ss-components-react";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    EDGE_ANNOUNCEMENTS,
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRIM_TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import {
    AXIS_HEIGHT,
    PAGE_TIMELINE_FAMILIES,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

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

export const TrimExample = (props: Props) => {
    const [clips, setClips] = props.clips;

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
                        view={props.view}
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
                                family={PAGE_TIMELINE_FAMILIES[clip.track % PAGE_TIMELINE_FAMILIES.length]}
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
