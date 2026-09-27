import { useEffect, useRef, useState } from "react";

import { Button, Timeline } from "@thewaver/ss-components-react";
import type { TimelineController } from "@thewaver/ss-components-react";
import type { Clip } from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelineItems.types";
import {
    CLIPS,
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelinePage.const";
import { AXIS_HEIGHT } from "@thewaver/ss-playground-core/App/StyledComponents/TimelineContent/TimelineContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageTimelineBlock,
    PageTimelineControls,
    PageTimelineFrame,
    PageTimelineLanes,
    PageTimelineMarker,
    PageTimelineRow,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
import type { TimelineExampleProps } from "../TimelinePage.types";

type Props = TimelineExampleProps;

const LANE_GAP = 6;
const ZOOM_IN = 0.6;
const ZOOM_OUT = 1 / ZOOM_IN;
const PAN_STEP = 0.4;
const TONES = ["info", "alert", "success", "error"] as const;
const MS_PER_SECOND = 1000;

export const TracksExample = (props: Props) => {
    const [controller, setController] = useState<TimelineController>();

    const [playhead, setPlayhead] = useState(REEL.start);
    const [isPlaying, setIsPlaying] = useState(false);

    const playheadRef = useRef(playhead);

    playheadRef.current = playhead;

    useEffect(() => {
        if (!isPlaying) return;

        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const next = playheadRef.current + (nowMs - lastMs) / MS_PER_SECOND;

            lastMs = nowMs;

            if (next >= REEL.end) {
                playheadRef.current = REEL.end;
                setPlayhead(REEL.end);
                setIsPlaying(false);

                return;
            }

            playheadRef.current = next;
            setPlayhead(next);
            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    }, [isPlaying]);

    return (
        <PageTimelineFrame>
            <PageTimelineRow>
                <PageTimelineLanes names={TRACKS} laneSize={LANE_SIZE} laneGap={LANE_GAP} />

                <PageTimelineTrack>
                    <Timeline<Clip>
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
                        viewState={props.viewState}
                        markers={[playhead]}
                        ariaLabel={"Cut of the episode"}
                        computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                        computeLane={(clip) => clip.track}
                        computeItemAriaLabel={(clip) =>
                            `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                        }
                        renderTick={(tick) => <PageTimelineTick tick={tick} label={formatStopwatch(tick.value)} />}
                        renderMarker={(marker) => <PageTimelineMarker marker={marker} tone={"playhead"} />}
                        renderItem={(clip, flags) => (
                            <PageTimelineBlock
                                flags={flags}
                                tone={TONES[clip.track % TONES.length]}
                                name={clip.name}
                                note={formatStopwatch(clip.to - clip.from)}
                            />
                        )}
                        onItemActivate={(clip) => props.onPick(clip.name)}
                        onMount={setController}
                    />
                </PageTimelineTrack>
            </PageTimelineRow>

            <PageTimelineControls>
                <Button
                    id={"tracksPlay"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Play</PageButtonContent>}
                    onClick={() => {
                        if (playhead >= REEL.end) {
                            playheadRef.current = REEL.start;
                            setPlayhead(REEL.start);
                        }

                        setIsPlaying(true);
                    }}
                />

                <Button
                    id={"tracksPause"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Pause</PageButtonContent>}
                    onClick={() => {
                        setIsPlaying(false);
                    }}
                />

                <Button
                    id={"tracksEarlier"}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Earlier</PageButtonContent>}
                    onClick={() => {
                        controller?.panBy(-PAN_STEP);
                    }}
                />

                <Button
                    id={"tracksLater"}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Later</PageButtonContent>}
                    onClick={() => {
                        controller?.panBy(PAN_STEP);
                    }}
                />

                <Button
                    id={"tracksZoomIn"}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Zoom in</PageButtonContent>}
                    onClick={() => {
                        controller?.zoomBy(ZOOM_IN);
                    }}
                />

                <Button
                    id={"tracksZoomOut"}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Zoom out</PageButtonContent>}
                    onClick={() => {
                        controller?.zoomBy(ZOOM_OUT);
                    }}
                />

                <Button
                    id={"tracksWholeReel"}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Whole reel</PageButtonContent>}
                    onClick={async () => {
                        props.viewState[1](REEL);
                    }}
                />
            </PageTimelineControls>
        </PageTimelineFrame>
    );
};
