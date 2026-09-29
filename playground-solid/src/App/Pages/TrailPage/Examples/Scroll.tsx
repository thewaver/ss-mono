import { createEffect, createSignal } from "solid-js";

import { ElementObserverSolidUtils, Trail, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageTrailMarker, PageTrailTrack } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailScrollExampleProps } from "../TrailPage.types";

const SCROLL_SIZE = { width: 320, height: styles.SCROLL_BOX_HEIGHT };
const SCROLL_PATH = "M 24 70 C 70 10, 110 10, 160 70 S 250 130, 296 70";
const MARKER_ID = "scrollMarker";

type Props = TrailScrollExampleProps;

export const ScrollExample = (props: Props) => {
    const [getBoxRef, setBoxRef] = createSignal<HTMLElement>();
    const [getRunwayRef, setRunwayRef] = createSignal<HTMLElement>();

    const getProgress = ElementObserverSolidUtils.createScrollContainerProgressObserver(
        getRunwayRef,
        getBoxRef,
        () => !access(props.isFollowing),
    );

    createEffect(() => {
        props.onProgressChange(getProgress());
    });

    return (
        <div ref={setBoxRef} id={"trailScrollBox"} class={styles.scrollBox}>
            <div class={styles.scrollPinned}>
                <PageMeasureBox>
                    <Trail
                        path={SCROLL_PATH}
                        size={SCROLL_SIZE}
                        durationMs={props.durationMs}
                        isLooping={props.isLooping}
                        isTurning={props.isTurning}
                        progress={[getProgress, () => undefined]}
                        playback={[() => false, () => undefined]}
                        renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                        renderTraveler={() => <PageTrailMarker id={MARKER_ID} />}
                    />
                </PageMeasureBox>
            </div>

            <div ref={setRunwayRef} class={styles.scrollRunway} />
        </div>
    );
};
