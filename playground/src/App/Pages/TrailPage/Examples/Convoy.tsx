import { createSignal } from "solid-js";

import { Button, Trail } from "@thewaver/ss-components";
import type { TrailController } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTrailTrack, PageTrailVehicle } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

import * as styles from "../TrailPage.css";

const CONVOY_SIZE = { width: 320, height: 150 };
const CONVOY_PATH = "M 30 120 C 80 120, 90 30, 160 30 S 240 120, 290 120";
const CONVOY_OFFSETS = [0, 0.12, 0.24, 0.36];
const LEAD_LABEL = "▶";

type Props = TrailExampleProps;

export const ConvoyExample = (props: Props) => {
    const [getController, setController] = createSignal<TrailController>();

    return (
        <div class={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={CONVOY_PATH}
                    size={CONVOY_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    followerOffsets={CONVOY_OFFSETS}
                    progressSignal={props.progressSignal}
                    playbackSignal={props.playbackSignal}
                    renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                    renderTraveler={(getPlace, index) => (
                        <PageTrailVehicle
                            id={`convoyVehicle${index}`}
                            place={getPlace}
                            label={index === 0 ? LEAD_LABEL : `${index}`}
                        />
                    )}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div class={styles.controls}>
                <Button
                    id={"convoyPlay"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Play</PageButtonContent>}
                    onClick={() => {
                        props.playbackSignal[1](true);
                    }}
                />

                <Button
                    id={"convoyPause"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Pause</PageButtonContent>}
                    onClick={() => {
                        props.playbackSignal[1](false);
                    }}
                />

                <Button
                    id={"convoyRewind"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Back to start</PageButtonContent>}
                    onClick={() => {
                        getController()?.seek(0);
                    }}
                />
            </div>
        </div>
    );
};
