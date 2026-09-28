import { useEffect, useRef } from "react";

import { ElementObserverReactUtils, Trail } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailScrollExampleProps } from "../TrailPage.types";

const SCROLL_SIZE = { width: 320, height: styles.SCROLL_BOX_HEIGHT };
const SCROLL_PATH = "M 24 70 C 70 10, 110 10, 160 70 S 250 130, 296 70";
const MARKER_ID = "scrollMarker";

type Props = TrailScrollExampleProps;

export const ScrollExample = (props: Props) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const runwayRef = useRef<HTMLDivElement>(null);

    const progress = ElementObserverReactUtils.useScrollContainerProgress(runwayRef, boxRef, !props.isFollowing);

    useEffect(() => {
        props.onProgressChange(progress);
    }, [progress]);

    return (
        <div ref={boxRef} id={"trailScrollBox"} className={styles.scrollBox}>
            <div className={styles.scrollPinned}>
                <PageMeasureBox>
                    <Trail
                        path={SCROLL_PATH}
                        size={SCROLL_SIZE}
                        durationMs={props.durationMs}
                        isLooping={props.isLooping}
                        isTurning={props.isTurning}
                        progressState={[progress, () => undefined]}
                        playbackState={[false, () => undefined]}
                        renderTrack={(path) => <PageTrailTrack path={path} />}
                        renderTraveler={() => <PageTrailMarker id={MARKER_ID} />}
                    />
                </PageMeasureBox>
            </div>

            <div ref={runwayRef} className={styles.scrollRunway} />
        </div>
    );
};
