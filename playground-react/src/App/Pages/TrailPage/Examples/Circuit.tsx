import { useState } from "react";

import { Button, Trail } from "@thewaver/ss-components-react";
import type { TrailController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TrailPage/TrailPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTrailTrack, PageTrailVehicle } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

const CIRCUIT_SIZE = { width: 320, height: 130 };
const CIRCUIT_PATH = "M 60 35 H 260 A 30 30 0 0 1 260 95 H 60 A 30 30 0 0 1 60 35 Z";
const VEHICLE_LABEL = "▶";
const VEHICLE_ID = "circuitVehicle";

type Props = TrailExampleProps;

export const CircuitExample = (props: Props) => {
    const [controller, setController] = useState<TrailController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={CIRCUIT_PATH}
                    size={CIRCUIT_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    progressState={props.progressState}
                    playbackState={props.playbackState}
                    renderTrack={(path) => <PageTrailTrack path={path} />}
                    renderTraveler={(place) => <PageTrailVehicle id={VEHICLE_ID} place={place} label={VEHICLE_LABEL} />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div className={styles.controls}>
                <Button
                    id={"circuitPlay"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Play</PageButtonContent>}
                    onClick={() => {
                        props.playbackState[1](true);
                    }}
                />

                <Button
                    id={"circuitPause"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Pause</PageButtonContent>}
                    onClick={() => {
                        props.playbackState[1](false);
                    }}
                />

                <Button
                    id={"circuitRewind"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Back to start</PageButtonContent>}
                    onClick={() => {
                        controller?.seek(0);
                    }}
                />
            </div>
        </div>
    );
};
