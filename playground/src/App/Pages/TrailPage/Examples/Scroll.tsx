import { createEffect, createSignal } from "solid-js";

import { ElementObserverUtils, Trail, access } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailScrollExampleProps } from "../TrailPage.types";

import * as styles from "../TrailPage.css";

const SCROLL_SIZE = { width: 320, height: 140 };
const SCROLL_PATH = "M 24 70 C 70 10, 110 10, 160 70 S 250 130, 296 70";
const MARKER_ID = "scrollMarker";

type Props = TrailScrollExampleProps;

export const ScrollExample = (props: Props) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverUtils.createViewportProgressObserver(
        getRootRef,
        () => !access(props.isFollowing),
    );

    createEffect(() => {
        props.onProgressChange(getProgress());
    });

    return (
        <div ref={setRootRef} class={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={SCROLL_PATH}
                    size={SCROLL_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    progressSignal={[getProgress, () => undefined]}
                    playbackSignal={[() => false, () => undefined]}
                    renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                    renderTraveler={() => <PageTrailMarker id={MARKER_ID} />}
                />
            </PageMeasureBox>
        </div>
    );
};
