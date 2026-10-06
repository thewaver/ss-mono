import { createEffect, createSignal, onCleanup, untrack } from "solid-js";

import { Button, Timeline, accessSignal } from "@thewaver/ss-components-solid";
import type { TimelineController } from "@thewaver/ss-components-solid";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import {
    CLIPS,
    LANE_SIZE,
    REEL,
    SECOND_STEPS,
    TRACKS,
    formatStopwatch,
} from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelinePage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import {
    AXIS_HEIGHT,
    PAGE_TIMELINE_FAMILIES,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
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
const MS_PER_SECOND = 1000;

export const TracksExample = (props: Props) => {
    const [getController, setController] = createSignal<TimelineController>();

    const [getPlayhead, setPlayhead] = createSignal(REEL.start);
    const [getIsPlaying, setIsPlaying] = createSignal(false);

    const viewSignal = accessSignal(() => props.view);

    createEffect(() => {
        if (!getIsPlaying()) return;

        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const next = untrack(getPlayhead) + (nowMs - lastMs) / MS_PER_SECOND;

            lastMs = nowMs;

            if (next >= REEL.end) {
                setPlayhead(REEL.end);
                setIsPlaying(false);

                return;
            }

            setPlayhead(next);
            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        onCleanup(() => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        });
    });

    return (
        <PageTimelineFrame>
            <PageTimelineRow>
                <PageTimelineLanes names={() => TRACKS} laneSize={() => LANE_SIZE} laneGap={() => LANE_GAP} />

                <PageTimelineTrack>
                    <Timeline<Clip>
                        range={() => REEL}
                        items={() => CLIPS}
                        laneSize={() => LANE_SIZE}
                        axisSize={() => AXIS_HEIGHT}
                        laneGap={() => LANE_GAP}
                        laneCount={() => TRACKS.length}
                        tickSteps={() => SECOND_STEPS}
                        isPannable={props.isPannable}
                        isZoomable={props.isZoomable}
                        isDisabled={props.isDisabled}
                        view={props.view}
                        markers={() => [getPlayhead()]}
                        ariaLabel={"Cut of the episode"}
                        computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                        computeLane={(clip) => clip.track}
                        computeItemAriaLabel={(clip) =>
                            `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                        }
                        renderTick={(getTick) => (
                            <PageTimelineTick tick={getTick} label={() => formatStopwatch(getTick().value)} />
                        )}
                        renderMarker={(getMarker) => <PageTimelineMarker marker={getMarker} tone={"playhead"} />}
                        renderItem={(getClip, getFlags) => (
                            <PageTimelineBlock
                                flags={getFlags}
                                family={() => PAGE_TIMELINE_FAMILIES[getClip().track % PAGE_TIMELINE_FAMILIES.length]}
                                name={() => getClip().name}
                                note={() => formatStopwatch(getClip().to - getClip().from)}
                            />
                        )}
                        onItemActivate={(clip) => props.onPick(clip.name)}
                        onMount={setController}
                    />
                </PageTimelineTrack>
            </PageTimelineRow>

            <PageTimelineControls>
                <Button
                    id={"tracksPlayback"}
                    ariaLabel={() => (getIsPlaying() ? "Pause" : "Play")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsPlaying() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        if (getIsPlaying()) {
                            setIsPlaying(false);

                            return;
                        }

                        if (getPlayhead() >= REEL.end) setPlayhead(REEL.start);

                        setIsPlaying(true);
                    }}
                />

                <Button
                    id={"tracksEarlier"}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Earlier"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.left} />
                    )}
                    onClick={() => {
                        getController()?.panBy(-PAN_STEP);
                    }}
                />

                <Button
                    id={"tracksLater"}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Later"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.right} />
                    )}
                    onClick={() => {
                        getController()?.panBy(PAN_STEP);
                    }}
                />

                <Button
                    id={"tracksZoomIn"}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Zoom in"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.zoomIn} />
                    )}
                    onClick={() => {
                        getController()?.zoomBy(ZOOM_IN);
                    }}
                />

                <Button
                    id={"tracksZoomOut"}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Zoom out"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.zoomOut} />
                    )}
                    onClick={() => {
                        getController()?.zoomBy(ZOOM_OUT);
                    }}
                />

                <Button
                    id={"tracksWholeReel"}
                    isDisabled={props.isDisabled}
                    ariaLabel={"Whole reel"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.fit} />
                    )}
                    onClick={async () => {
                        viewSignal[1](() => REEL);
                    }}
                />
            </PageTimelineControls>
        </PageTimelineFrame>
    );
};
