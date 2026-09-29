<script lang="ts">
    import { Timeline } from "@thewaver/ss-components-svelte";
    import {
        DAY,
        LANE_SIZE,
        MEETINGS,
        MINUTE_STEPS,
        formatClock,
    } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
    import { AXIS_HEIGHT } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

    import PageTimelineBlock from "../../../StyledComponents/TimelineContent/PageTimelineBlock.svelte";
    import PageTimelineFrame from "../../../StyledComponents/TimelineContent/PageTimelineFrame.svelte";
    import PageTimelineMarker from "../../../StyledComponents/TimelineContent/PageTimelineMarker.svelte";
    import PageTimelineTick from "../../../StyledComponents/TimelineContent/PageTimelineTick.svelte";
    import PageTimelineTrack from "../../../StyledComponents/TimelineContent/PageTimelineTrack.svelte";
    import type { TimelineExampleProps } from "../TimelinePage.types";

    type Props = TimelineExampleProps;

    const MINUTES_PER_HOUR = 60;
    const NOW_REFRESH_MS = 30000;

    const getMinutesNow = () => {
        const now = new Date();

        return now.getHours() * MINUTES_PER_HOUR + now.getMinutes();
    };

    let { view = $bindable(), ...props }: Props = $props();

    let now = $state(getMinutesNow());

    $effect(() => {
        const timerId = setInterval(() => {
            now = getMinutesNow();
        }, NOW_REFRESH_MS);

        return () => {
            clearInterval(timerId);
        };
    });
</script>

<PageTimelineFrame>
    <PageTimelineTrack>
        <Timeline
            range={DAY}
            items={MEETINGS}
            laneSize={LANE_SIZE}
            axisSize={AXIS_HEIGHT}
            tickSteps={MINUTE_STEPS}
            isPannable={props.isPannable}
            isZoomable={props.isZoomable}
            isDisabled={props.isDisabled}
            bind:view
            markers={[now]}
            ariaLabel={"Today's meetings"}
            computeSpan={(meeting) => ({ start: meeting.from, end: meeting.to })}
            computeIsItemDisabled={(meeting) => meeting.isCanceled === true}
            computeItemAriaLabel={(meeting) =>
                `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`}
            onItemActivate={(meeting) => props.onPick(meeting.name)}
        >
            {#snippet renderTick(tick)}
                <PageTimelineTick {tick} label={formatClock(tick.value)} />
            {/snippet}

            {#snippet renderMarker(marker)}
                <PageTimelineMarker {marker} tone={"now"} />
            {/snippet}

            {#snippet renderItem(meeting, flags)}
                <PageTimelineBlock
                    {flags}
                    tone={"info"}
                    name={meeting.name}
                    note={`${formatClock(meeting.from)} · ${meeting.room}`}
                />
            {/snippet}
        </Timeline>
    </PageTimelineTrack>
</PageTimelineFrame>
