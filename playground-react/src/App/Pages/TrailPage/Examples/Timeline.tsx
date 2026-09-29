import { useState } from "react";

import { Range, Trail } from "@thewaver/ss-components-react";
import type { TrailController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

const TIMELINE_SIZE = { width: 320, height: 140 };
const TIMELINE_PATH = "M 24 108 C 92 12, 168 154, 232 74 S 296 26, 304 58";
const PERCENT = 100;
const SLIDER_STEP = 1;
const MARKER_ID = "timelineMarker";

type Props = TrailExampleProps;

export const TimelineExample = (props: Props) => {
    const [controller, setController] = useState<TrailController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={TIMELINE_PATH}
                    size={TIMELINE_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    progress={props.progress}
                    playback={props.playback}
                    renderTrack={(path) => <PageTrailTrack path={path} />}
                    renderTraveler={() => <PageTrailMarker id={MARKER_ID} />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div className={styles.slider}>
                <Range
                    id={"timelineScrubber"}
                    sizing={"fill"}
                    ariaLabel={"Position along the path"}
                    min={0}
                    max={PERCENT}
                    step={SLIDER_STEP}
                    value={[
                        Math.round(props.progress[0] * PERCENT),
                        (value: number) => controller?.seek(value / PERCENT),
                    ]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={TIMELINE_SIZE.width} />
                    )}
                />
            </div>
        </div>
    );
};
