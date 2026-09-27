import { createSignal, onCleanup } from "solid-js";

import { Timeline } from "@thewaver/ss-components-solid";
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
    const [getNow, setNow] = createSignal(getMinutesNow());

    const timerId = setInterval(() => {
        setNow(getMinutesNow());
    }, NOW_REFRESH_MS);

    onCleanup(() => {
        clearInterval(timerId);
    });

    return (
        <PageTimelineFrame>
            <PageTimelineTrack>
                <Timeline<Meeting>
                    range={() => DAY}
                    items={() => MEETINGS}
                    laneSize={() => LANE_SIZE}
                    axisSize={() => AXIS_HEIGHT}
                    tickSteps={() => MINUTE_STEPS}
                    isPannable={props.isPannable}
                    isZoomable={props.isZoomable}
                    isDisabled={props.isDisabled}
                    viewSignal={props.viewSignal}
                    markers={() => [getNow()]}
                    ariaLabel={"Today's meetings"}
                    computeSpan={(meeting) => ({ start: meeting.from, end: meeting.to })}
                    computeIsItemDisabled={(meeting) => meeting.isCanceled === true}
                    computeItemAriaLabel={(meeting) =>
                        `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`
                    }
                    renderTick={(getTick) => (
                        <PageTimelineTick tick={getTick} label={() => formatClock(getTick().value)} />
                    )}
                    renderMarker={(getMarker) => <PageTimelineMarker marker={getMarker} tone={"now"} />}
                    renderItem={(getMeeting, getFlags) => (
                        <PageTimelineBlock
                            flags={getFlags}
                            tone={"info"}
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
