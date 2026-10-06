<script lang="ts">
    import { Button, Timeline } from "@thewaver/ss-components-svelte";
    import type { TimelineController } from "@thewaver/ss-components-svelte";
    import {
        CLIPS,
        LANE_SIZE,
        REEL,
        SECOND_STEPS,
        TRACKS,
        formatStopwatch,
    } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
    import { AXIS_HEIGHT, PAGE_TIMELINE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageTimelineBlock from "../../../StyledComponents/TimelineContent/PageTimelineBlock.svelte";
    import PageTimelineControls from "../../../StyledComponents/TimelineContent/PageTimelineControls.svelte";
    import PageTimelineFrame from "../../../StyledComponents/TimelineContent/PageTimelineFrame.svelte";
    import PageTimelineLanes from "../../../StyledComponents/TimelineContent/PageTimelineLanes.svelte";
    import PageTimelineMarker from "../../../StyledComponents/TimelineContent/PageTimelineMarker.svelte";
    import PageTimelineRow from "../../../StyledComponents/TimelineContent/PageTimelineRow.svelte";
    import PageTimelineTick from "../../../StyledComponents/TimelineContent/PageTimelineTick.svelte";
    import PageTimelineTrack from "../../../StyledComponents/TimelineContent/PageTimelineTrack.svelte";
    import type { TimelineExampleProps } from "../TimelinePage.types";

    type Props = TimelineExampleProps;

    const LANE_GAP = 6;
    const ZOOM_IN = 0.6;
    const ZOOM_OUT = 1 / ZOOM_IN;
    const PAN_STEP = 0.4;
    const MS_PER_SECOND = 1000;

    let { view = $bindable(), ...props }: Props = $props();

    let controller: TimelineController | undefined;

    let playhead = $state(REEL.start);
    let isPlaying = $state(false);

    $effect(() => {
        if (!isPlaying) return;

        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const next = playhead + (nowMs - lastMs) / MS_PER_SECOND;

            lastMs = nowMs;

            if (next >= REEL.end) {
                playhead = REEL.end;
                isPlaying = false;

                return;
            }

            playhead = next;
            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    });
</script>

<PageTimelineFrame>
    <PageTimelineRow>
        <PageTimelineLanes names={TRACKS} laneSize={LANE_SIZE} laneGap={LANE_GAP} />

        <PageTimelineTrack>
            <Timeline
                range={REEL}
                items={CLIPS}
                laneSize={LANE_SIZE}
                axisSize={AXIS_HEIGHT}
                laneGap={LANE_GAP}
                laneCount={TRACKS.length}
                tickSteps={SECOND_STEPS}
                isPannable={props.isPannable}
                isZoomable={props.isZoomable}
                isDisabled={props.isDisabled}
                bind:view
                markers={[playhead]}
                ariaLabel={"Cut of the episode"}
                computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                computeLane={(clip) => clip.track}
                computeItemAriaLabel={(clip) =>
                    `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`}
                onItemActivate={(clip) => props.onPick(clip.name)}
                onMount={(mounted) => {
                    controller = mounted;
                }}
            >
                {#snippet renderTick(tick)}
                    <PageTimelineTick {tick} label={formatStopwatch(tick.value)} />
                {/snippet}

                {#snippet renderMarker(marker)}
                    <PageTimelineMarker {marker} tone={"playhead"} />
                {/snippet}

                {#snippet renderItem(clip, flags)}
                    <PageTimelineBlock
                        {flags}
                        family={PAGE_TIMELINE_FAMILIES[clip.track % PAGE_TIMELINE_FAMILIES.length]}
                        name={clip.name}
                        note={formatStopwatch(clip.to - clip.from)}
                    />
                {/snippet}
            </Timeline>
        </PageTimelineTrack>
    </PageTimelineRow>

    <PageTimelineControls>
        <Button
            id={"tracksPlayback"}
            ariaLabel={isPlaying ? "Pause" : "Play"}
            onClick={() => {
                if (isPlaying) {
                    isPlaying = false;

                    return;
                }

                if (playhead >= REEL.end) playhead = REEL.start;

                isPlaying = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        <Button
            id={"tracksEarlier"}
            ariaLabel={"Earlier"}
            isDisabled={props.isDisabled}
            onClick={() => {
                controller?.panBy(-PAN_STEP);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.left} />
            {/snippet}
        </Button>

        <Button
            id={"tracksLater"}
            ariaLabel={"Later"}
            isDisabled={props.isDisabled}
            onClick={() => {
                controller?.panBy(PAN_STEP);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.right} />
            {/snippet}
        </Button>

        <Button
            id={"tracksZoomIn"}
            ariaLabel={"Zoom in"}
            isDisabled={props.isDisabled}
            onClick={() => {
                controller?.zoomBy(ZOOM_IN);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.zoomIn} />
            {/snippet}
        </Button>

        <Button
            id={"tracksZoomOut"}
            ariaLabel={"Zoom out"}
            isDisabled={props.isDisabled}
            onClick={() => {
                controller?.zoomBy(ZOOM_OUT);
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.zoomOut} />
            {/snippet}
        </Button>

        <Button
            id={"tracksWholeReel"}
            ariaLabel={"Whole reel"}
            isDisabled={props.isDisabled}
            onClick={async () => {
                view = REEL;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.fit} />
            {/snippet}
        </Button>
    </PageTimelineControls>
</PageTimelineFrame>
