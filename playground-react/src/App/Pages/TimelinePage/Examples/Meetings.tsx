import { useEffect, useState } from "react";

import { Timeline } from "@thewaver/ss-components-react";
import type { Meeting } from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelineItems.types";
import {
    DAY,
    LANE_SIZE,
    MEETINGS,
    MINUTE_STEPS,
    formatClock,
} from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelinePage.const";
import { AXIS_HEIGHT } from "@thewaver/ss-playground-core/App/StyledComponents/TimelineContent/TimelineContent.css";

import {
    PageTimelineBlock,
    PageTimelineFrame,
    PageTimelineMarker,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
import type { TimelineExampleProps } from "../TimelinePage.types";

type Props = TimelineExampleProps;

const MINUTES_PER_HOUR = 60;
const NOW_REFRESH_MS = 30000;

const getMinutesNow = () => {
    const now = new Date();

    return now.getHours() * MINUTES_PER_HOUR + now.getMinutes();
};

export const MeetingsExample = (props: Props) => {
    const [now, setNow] = useState(getMinutesNow);

    useEffect(() => {
        const timerId = setInterval(() => {
            setNow(getMinutesNow());
        }, NOW_REFRESH_MS);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <PageTimelineFrame>
            <PageTimelineTrack>
                <Timeline<Meeting>
                    range={DAY}
                    items={MEETINGS}
                    laneSize={LANE_SIZE}
                    axisSize={AXIS_HEIGHT}
                    tickSteps={MINUTE_STEPS}
                    isPannable={props.isPannable}
                    isZoomable={props.isZoomable}
                    isDisabled={props.isDisabled}
                    viewState={props.viewState}
                    markers={[now]}
                    ariaLabel={"Today's meetings"}
                    computeSpan={(meeting) => ({ start: meeting.from, end: meeting.to })}
                    computeIsItemDisabled={(meeting) => meeting.isCanceled === true}
                    computeItemAriaLabel={(meeting) =>
                        `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`
                    }
                    renderTick={(tick) => <PageTimelineTick tick={tick} label={formatClock(tick.value)} />}
                    renderMarker={(marker) => <PageTimelineMarker marker={marker} tone={"now"} />}
                    renderItem={(meeting, flags) => (
                        <PageTimelineBlock
                            flags={flags}
                            tone={"info"}
                            name={meeting.name}
                            note={`${formatClock(meeting.from)} · ${meeting.room}`}
                        />
                    )}
                    onItemActivate={(meeting) => props.onPick(meeting.name)}
                />
            </PageTimelineTrack>
        </PageTimelineFrame>
    );
};
