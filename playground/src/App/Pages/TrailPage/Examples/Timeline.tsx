import { createSignal } from "solid-js";

import { Range, Trail, accessSignal } from "@thewaver/ss-components";
import type { TrailController } from "@thewaver/ss-components";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

import * as styles from "../TrailPage.css";

const TIMELINE_SIZE = { width: 320, height: 140 };
const TIMELINE_PATH = "M 24 108 C 92 12, 168 154, 232 74 S 296 26, 304 58";
const PERCENT = 100;
const SLIDER_STEP = 1;
const MARKER_ID = "timelineMarker";

type Props = TrailExampleProps;

export const TimelineExample = (props: Props) => {
    const [getController, setController] = createSignal<TrailController>();

    const progressSignal = accessSignal(() => props.progressSignal);

    return (
        <div class={styles.stack}>
            <Trail
                path={TIMELINE_PATH}
                size={TIMELINE_SIZE}
                durationMs={props.durationMs}
                isLooping={props.isLooping}
                isTurning={props.isTurning}
                progressSignal={props.progressSignal}
                isPlayingSignal={props.isPlayingSignal}
                renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                renderTraveller={() => <PageTrailMarker id={MARKER_ID} />}
                onMount={setController}
            />

            <div class={styles.slider}>
                <Range
                    id={"timelineScrubber"}
                    sizing={"fill"}
                    ariaLabel={"Position along the path"}
                    min={() => 0}
                    max={() => PERCENT}
                    step={() => SLIDER_STEP}
                    valueSignal={[
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
