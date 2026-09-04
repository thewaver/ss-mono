import { Timeline } from "@thewaver/ss-components";

import {
    PageTimelineBlock,
    PageTimelineFrame,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
import { DAY, MEETINGS, MINUTE_STEPS, formatClock } from "../TimelinePage.const";
import type { Meeting, TimelineExampleProps } from "../TimelinePage.types";

import { AXIS_HEIGHT } from "../../../StyledComponents/TimelineContent/TimelineContent.css";

type Props = TimelineExampleProps;

export const MeetingsExample = (props: Props) => {
    return (
        <PageTimelineFrame>
            <PageTimelineTrack>
                <Timeline<Meeting>
                    range={() => DAY}
                    items={() => MEETINGS}
                    laneSize={props.laneSize}
                    axisSize={() => AXIS_HEIGHT}
                    minTickGap={props.minTickGap}
                    tickSteps={() => MINUTE_STEPS}
                    isPannable={props.isPannable}
                    isZoomable={props.isZoomable}
                    isDisabled={props.isDisabled}
                    viewSignal={props.viewSignal}
                    ariaLabel={"Today's meetings"}
                    computeSpan={(meeting) => ({ start: meeting.from, end: meeting.to })}
                    computeIsItemDisabled={(meeting) => meeting.isCancelled === true}
                    computeItemAriaLabel={(meeting) =>
                        `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`
                    }
                    renderTick={(getTick) => (
                        <PageTimelineTick tick={getTick} label={() => formatClock(getTick().value)} />
                    )}
                    renderItem={(getMeeting, getFlags) => (
                        <PageTimelineBlock
                            flags={getFlags}
                            tone={"primary"}
                            name={() => getMeeting().name}
                            note={() => `${formatClock(getMeeting().from)} · ${getMeeting().room}`}
                        />
                    )}
                    onItemActivate={(meeting) => props.onPick(meeting.name)}
                />
            </PageTimelineTrack>
        </PageTimelineFrame>
    );
};
