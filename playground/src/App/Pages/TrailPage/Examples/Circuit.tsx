import { createSignal } from "solid-js";

import { Button, Trail } from "@thewaver/ss-components";
import type { TrailController } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageTrailTrack, PageTrailVehicle } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

import * as styles from "../TrailPage.css";

const CIRCUIT_SIZE = { width: 320, height: 130 };
const CIRCUIT_PATH = "M 60 35 H 260 A 30 30 0 0 1 260 95 H 60 A 30 30 0 0 1 60 35 Z";
const VEHICLE_LABEL = "▶";
const VEHICLE_ID = "circuitVehicle";

type Props = TrailExampleProps;

export const CircuitExample = (props: Props) => {
    const [getController, setController] = createSignal<TrailController>();

    return (
        <div class={styles.stack}>
            <Trail
                path={CIRCUIT_PATH}
                size={CIRCUIT_SIZE}
                durationMs={props.durationMs}
                isLooping={props.isLooping}
                isTurning={props.isTurning}
                progressSignal={props.progressSignal}
                isPlayingSignal={props.isPlayingSignal}
                renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                renderTraveller={(getPlace) => (
                    <PageTrailVehicle id={VEHICLE_ID} place={getPlace} label={VEHICLE_LABEL} />
                )}
                onMount={setController}
            />

            <div class={styles.controls}>
                <Button
                    id={"circuitPlay"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Play</PageButtonContent>}
                    onClick={() => {
                        getController()?.play();
                    }}
                />

                <Button
                    id={"circuitPause"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Pause</PageButtonContent>}
                    onClick={() => {
                        getController()?.pause();
                    }}
                />

                <Button
                    id={"circuitRewind"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Back to start</PageButtonContent>}
                    onClick={() => {
                        getController()?.seek(0);
                    }}
                />
            </div>
        </div>
    );
};
