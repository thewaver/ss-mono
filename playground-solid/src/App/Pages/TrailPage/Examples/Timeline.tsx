import { createSignal } from "solid-js";

import { Range, Trail, accessSignal } from "@thewaver/ss-components-solid";
import type { TrailController } from "@thewaver/ss-components-solid";
import { POSITION_ALONG_PATH_LABEL, TIMELINE_PATH } from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

const TIMELINE_SIZE = { width: 320, height: 140 };
const PERCENT = 100;
const SLIDER_STEP = 1;
const MARKER_ID = "timelineMarker";

type Props = TrailExampleProps;

export const TimelineExample = (props: Props) => {
    const [getController, setController] = createSignal<TrailController>();

    const progressSignal = accessSignal(() => props.progress);

    return (
        <div class={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={TIMELINE_PATH}
                    size={TIMELINE_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    progress={props.progress}
                    playback={props.playback}
                    renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                    renderTraveler={() => <PageTrailMarker id={MARKER_ID} />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div class={styles.slider}>
                <Range
                    id={"timelineScrubber"}
                    sizing={"fill"}
                    ariaLabel={POSITION_ALONG_PATH_LABEL}
                    min={0}
                    max={PERCENT}
                    step={SLIDER_STEP}
                    value={[
                        () => Math.round(progressSignal[0]() * PERCENT),
                        (value: number) => getController()?.seek(value / PERCENT),
                    ]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => TIMELINE_SIZE.width} />
                    )}
                />
            </div>
        </div>
    );
};
