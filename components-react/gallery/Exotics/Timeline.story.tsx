import { type ReactNode, useEffect, useState, useSyncExternalStore } from "react";

import type {
    InteractionFlags,
    TimelineEdgeAnnouncements,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineSpan,
    TimelineTick,
} from "@thewaver/ss-components";

import { Timeline, type TimelineController } from "../../src";

type Meeting = { name: string; room: string; from: number; to: number; isCanceled?: boolean };

type Clip = { name: string; track: number; from: number; to: number };

type GestureProps = { isPannable?: boolean; isZoomable?: boolean; isDisabled?: boolean };

const MINUTES_PER_HOUR = 60;
const TENS = 10;
const LANE_SIZE = 48;
const AXIS_SIZE = 24;
const LANE_GAP = 6;
const WIDTH = 800;
const ZOOM_IN = 0.6;
const ZOOM_OUT = 1 / ZOOM_IN;
const PAN_STEP = 0.4;
const MS_PER_SECOND = 1000;
const NOTHING_PICKED = "nothing yet";
const NO_SUBSCRIPTION = () => () => {};

const at = (hour: number, minute = 0) => hour * MINUTES_PER_HOUR + minute;

const DAY: TimelineSpan = { start: at(8), end: at(19) };
const MINUTE_STEPS = [5, 15, 30, at(1), at(2), at(4)];

const MEETINGS: Meeting[] = [
    { name: "Standup", room: "Kitchen", from: at(9), to: at(9, 15) },
    { name: "Design review", room: "Blue room", from: at(9, 30), to: at(11) },
    { name: "Interview", room: "Booth 2", from: at(10), to: at(11) },
    { name: "Vendor call", room: "Booth 1", from: at(10, 30), to: at(11, 15) },
    { name: "Lunch", room: "Out", from: at(12), to: at(13) },
    { name: "Pairing", room: "Desk", from: at(13), to: at(15, 30) },
    { name: "All hands", room: "Hall", from: at(14), to: at(15) },
    { name: "Retro", room: "Blue room", from: at(15, 30), to: at(16, 30) },
    { name: "Budget", room: "Blue room", from: at(16), to: at(17), isCanceled: true },
    { name: "Handover", room: "Desk", from: at(17, 30), to: at(18) },
];

const REEL: TimelineSpan = { start: 0, end: 180 };
const SECOND_STEPS = [1, 5, 15, 30, 60];
const TRACKS = ["Video", "Audio", "Titles"];

const CLIPS: Clip[] = [
    { name: "Cold open", track: 0, from: 0, to: 22 },
    { name: "Interview", track: 0, from: 22, to: 96 },
    { name: "B roll", track: 0, from: 96, to: 148 },
    { name: "Sign off", track: 0, from: 148, to: 180 },
    { name: "Theme", track: 1, from: 0, to: 30 },
    { name: "Room tone", track: 1, from: 30, to: 150 },
    { name: "Outro", track: 1, from: 150, to: 180 },
    { name: "Title card", track: 2, from: 4, to: 14 },
    { name: "Lower third", track: 2, from: 28, to: 40 },
    { name: "Credits", track: 2, from: 160, to: 178 },
];

const TRIM_TRACKS = ["Video", "Audio"];
const TRIM_CLIPS = CLIPS.filter((clip) => clip.track < TRIM_TRACKS.length);

const formatClock = (minutes: number) => {
    const hour = Math.floor(minutes / MINUTES_PER_HOUR);
    const minute = Math.round(minutes - hour * MINUTES_PER_HOUR);

    return `${hour}:${minute < TENS ? "0" : ""}${minute}`;
};

const formatStopwatch = formatClock;

const getMinutesNow = () => {
    const now = new Date();

    return now.getHours() * MINUTES_PER_HOUR + now.getMinutes();
};

const EDGE_ANNOUNCEMENTS: TimelineEdgeAnnouncements = {
    restingKeyHint: "Press Enter to take hold of the end of this clip.",
    heldKeyHint:
        "Left and right arrows move it a second at a time, Home and End switch between the start and the end, Enter drops it and Escape puts it back.",
    computePlaceLabel: (edge, span) =>
        `${edge} at ${formatStopwatch(span[edge])}, ${formatStopwatch(span.end - span.start)} long`,
    computePickedUp: (itemLabel) => `Holding an end of ${itemLabel}.`,
    computePickedUpByKey: (itemLabel, _zoneLabel, placeLabel, keyHint) =>
        `Holding ${itemLabel}, ${placeLabel}. ${keyHint}`,
    computeAimed: (placeLabel) => `${placeLabel}.`,
    computeZoneEntered: (_zoneLabel, placeLabel) => placeLabel,
    computeReturned: (itemLabel) => `${itemLabel} put back as it was.`,
    computeLeftInPlace: (itemLabel) => `${itemLabel} left as it was.`,
    computeRefused: (itemLabel) => `${itemLabel} put back as it was.`,
    computeDropped: (_itemLabel, _zoneLabel, placeLabel) => `Dropped, ${placeLabel}.`,
};

const renderTick = (format: (value: number) => string) => (tick: TimelineTick) =>
    tick.isMajor ? <span style={{ position: "absolute", top: 0, fontSize: 10 }}>{format(tick.value)}</span> : null;

const renderMarker = (marker: TimelineMarker) =>
    marker.isInView ? <div style={{ position: "absolute", inset: 0, width: 2, background: "red" }} /> : null;

const renderBlock = (name: string, note: string, flags: InteractionFlags<TimelineItemRenderProps>): ReactNode => (
    <div
        data-held={flags.heldEdge}
        style={{
            boxSizing: "border-box",
            height: "100%",
            overflow: "hidden",
            border: "1px solid #336",
            background: flags.isDisabled ? "#ddd" : flags.isFocused ? "#cce" : "#eef",
            fontSize: 11,
        }}
    >
        {`${name} · ${note}`}
    </div>
);

const Frame = (props: { testId: string; children: ReactNode }) => (
    <div data-testid={props.testId} style={{ width: WIDTH, margin: 20 }}>
        <div data-demo>{props.children}</div>
    </div>
);

export const Meetings = ({ isPannable, isZoomable, isDisabled }: GestureProps) => {
    const viewState = useState(DAY);
    const [picked, setPicked] = useState(NOTHING_PICKED);
    const [now] = useState(getMinutesNow);

    return (
        <>
            <Frame testId="meetings">
                <Timeline<Meeting>
                    range={DAY}
                    items={MEETINGS}
                    laneSize={LANE_SIZE}
                    axisSize={AXIS_SIZE}
                    tickSteps={MINUTE_STEPS}
                    isPannable={isPannable}
                    isZoomable={isZoomable}
                    isDisabled={isDisabled}
                    viewState={viewState}
                    markers={[now]}
                    ariaLabel="Today's meetings"
                    computeSpan={(meeting) => ({ start: meeting.from, end: meeting.to })}
                    computeIsItemDisabled={(meeting) => meeting.isCanceled === true}
                    computeItemAriaLabel={(meeting) =>
                        `${meeting.name}, ${formatClock(meeting.from)} to ${formatClock(meeting.to)}, ${meeting.room}`
                    }
                    renderTick={renderTick(formatClock)}
                    renderMarker={renderMarker}
                    renderItem={(meeting, flags) => renderBlock(meeting.name, meeting.room, flags)}
                    onItemActivate={(meeting) => setPicked(meeting.name)}
                />
            </Frame>
            <output data-readout="meetings">{`showing ${formatClock(viewState[0].start)} to ${formatClock(viewState[0].end)}`}</output>
            <output data-readout="picked">{picked}</output>
        </>
    );
};

export const Tracks = ({ isPannable, isZoomable, isDisabled }: GestureProps) => {
    const viewState = useState(REEL);
    const [controller, setController] = useState<TimelineController>();
    const [picked, setPicked] = useState(NOTHING_PICKED);
    const [playhead, setPlayhead] = useState(REEL.start);
    const [isPlaying, setIsPlaying] = useState(false);

    const view = useSyncExternalStore(controller?.subscribe ?? NO_SUBSCRIPTION, () => controller?.getView() ?? REEL);

    useEffect(() => {
        if (!isPlaying) return;

        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const elapsed = (nowMs - lastMs) / MS_PER_SECOND;

            lastMs = nowMs;

            setPlayhead((previous) => Math.min(previous + elapsed, REEL.end));
            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    }, [isPlaying]);

    return (
        <>
            <Frame testId="tracks">
                <Timeline<Clip>
                    range={REEL}
                    items={CLIPS}
                    laneSize={LANE_SIZE}
                    axisSize={AXIS_SIZE}
                    laneGap={LANE_GAP}
                    laneCount={TRACKS.length}
                    tickSteps={SECOND_STEPS}
                    isPannable={isPannable}
                    isZoomable={isZoomable}
                    isDisabled={isDisabled}
                    viewState={viewState}
                    markers={[playhead]}
                    ariaLabel="Cut of the episode"
                    computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                    computeLane={(clip) => clip.track}
                    computeItemAriaLabel={(clip) =>
                        `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                    }
                    renderTick={renderTick(formatStopwatch)}
                    renderMarker={renderMarker}
                    renderItem={(clip, flags) => renderBlock(clip.name, formatStopwatch(clip.to - clip.from), flags)}
                    onItemActivate={(clip) => setPicked(clip.name)}
                    onMount={setController}
                />
            </Frame>
            <div>
                <button id="tracksPlay" type="button" onClick={() => setIsPlaying(true)}>
                    Play
                </button>
                <button id="tracksPause" type="button" onClick={() => setIsPlaying(false)}>
                    Pause
                </button>
                <button id="tracksEarlier" type="button" onClick={() => controller?.panBy(-PAN_STEP)}>
                    Earlier
                </button>
                <button id="tracksLater" type="button" onClick={() => controller?.panBy(PAN_STEP)}>
                    Later
                </button>
                <button id="tracksZoomIn" type="button" onClick={() => controller?.zoomBy(ZOOM_IN)}>
                    Zoom in
                </button>
                <button id="tracksZoomOut" type="button" onClick={() => controller?.zoomBy(ZOOM_OUT)}>
                    Zoom out
                </button>
                <button id="tracksWholeReel" type="button" onClick={() => viewState[1](REEL)}>
                    Whole reel
                </button>
            </div>
            <output data-readout="tracks">{`showing ${formatStopwatch(view.start)} to ${formatStopwatch(view.end)}`}</output>
            <output data-readout="picked">{picked}</output>
        </>
    );
};

export const Trim = ({ isPannable, isZoomable, isDisabled }: GestureProps) => {
    const [clips, setClips] = useState(TRIM_CLIPS);
    const [trimmed, setTrimmed] = useState<Clip>();
    const [picked, setPicked] = useState(NOTHING_PICKED);

    return (
        <>
            <Frame testId="trim">
                <Timeline<Clip>
                    range={REEL}
                    items={clips}
                    laneSize={LANE_SIZE}
                    axisSize={AXIS_SIZE}
                    laneGap={LANE_GAP}
                    laneCount={TRIM_TRACKS.length}
                    tickSteps={SECOND_STEPS}
                    isPannable={isPannable}
                    isZoomable={isZoomable}
                    isDisabled={isDisabled}
                    edgeAnnouncements={EDGE_ANNOUNCEMENTS}
                    ariaLabel="Clips to trim"
                    computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                    computeLane={(clip) => clip.track}
                    computeSnapValue={(value) => Math.round(value)}
                    computeItemAriaLabel={(clip) =>
                        `${clip.name}, ${TRIM_TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                    }
                    renderTick={renderTick(formatStopwatch)}
                    renderItem={(clip, flags) =>
                        renderBlock(clip.name, formatStopwatch(flags.span.end - flags.span.start), flags)
                    }
                    onItemActivate={(clip) => setPicked(clip.name)}
                    onSpanChange={(clip, index, span) => {
                        const next = { ...clip, from: span.start, to: span.end };

                        setClips((previous) => previous.map((entry, at) => (at === index ? next : entry)));
                        setTrimmed(next);
                    }}
                />
            </Frame>
            <output data-readout="trim">
                {trimmed === undefined
                    ? "nothing trimmed yet"
                    : `${trimmed.name} now runs ${formatStopwatch(trimmed.from)} to ${formatStopwatch(trimmed.to)}`}
            </output>
            <output data-readout="picked">{picked}</output>
            <button type="button" data-testid="after">
                After
            </button>
        </>
    );
};
