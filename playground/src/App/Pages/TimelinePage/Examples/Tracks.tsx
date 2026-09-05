import { createSignal } from "solid-js";

import { Button, Timeline, accessSignal } from "@thewaver/ss-components";
import type { TimelineController } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageTimelineBlock,
    PageTimelineControls,
    PageTimelineFrame,
    PageTimelineLanes,
    PageTimelineRow,
    PageTimelineTick,
    PageTimelineTrack,
} from "../../../StyledComponents/TimelineContent/TimelineContent";
import { CLIPS, LANE_SIZE, REEL, SECOND_STEPS, TRACKS, formatStopwatch } from "../TimelinePage.const";
import type { Clip, TimelineExampleProps } from "../TimelinePage.types";

import { AXIS_HEIGHT } from "../../../StyledComponents/TimelineContent/TimelineContent.css";

type Props = TimelineExampleProps;

const LANE_GAP = 6;
const ZOOM_IN = 0.6;
const ZOOM_OUT = 1 / ZOOM_IN;
const PAN_STEP = 0.4;
const TONES = ["info", "alert", "success", "error"] as const;

export const TracksExample = (props: Props) => {
    const [getController, setController] = createSignal<TimelineController>();

    const viewSignal = accessSignal(() => props.viewSignal);

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
                        viewSignal={props.viewSignal}
                        ariaLabel={"Cut of the episode"}
                        computeSpan={(clip) => ({ start: clip.from, end: clip.to })}
                        computeLane={(clip) => clip.track}
                        computeItemAriaLabel={(clip) =>
                            `${clip.name}, ${TRACKS[clip.track]}, ${formatStopwatch(clip.from)} to ${formatStopwatch(clip.to)}`
                        }
                        renderTick={(getTick) => (
                            <PageTimelineTick tick={getTick} label={() => formatStopwatch(getTick().value)} />
                        )}
                        renderItem={(getClip, getFlags) => (
                            <PageTimelineBlock
                                flags={getFlags}
                                tone={() => TONES[getClip().track % TONES.length]}
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
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Earlier</PageButtonContent>}
                    onClick={async () => getController()?.panBy(-PAN_STEP)}
                />

                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Later</PageButtonContent>}
                    onClick={async () => getController()?.panBy(PAN_STEP)}
                />

                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Zoom in</PageButtonContent>}
                    onClick={async () => getController()?.zoomBy(ZOOM_IN)}
                />

                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Zoom out</PageButtonContent>}
                    onClick={async () => getController()?.zoomBy(ZOOM_OUT)}
                />

                <Button
                    isDisabled={props.isDisabled}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Whole reel</PageButtonContent>}
                    onClick={async () => {
                        viewSignal[1](() => REEL);
                    }}
                />
            </PageTimelineControls>
        </PageTimelineFrame>
    );
};
