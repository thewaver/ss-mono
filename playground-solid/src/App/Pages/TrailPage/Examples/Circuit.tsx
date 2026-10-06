import { createSignal } from "solid-js";

import { Button, Trail } from "@thewaver/ss-components-solid";
import type { TrailController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTrailTrack, PageTrailVehicle } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

const CIRCUIT_SIZE = { width: 320, height: 130 };
const CIRCUIT_PATH = "M 60 35 H 260 A 30 30 0 0 1 260 95 H 60 A 30 30 0 0 1 60 35 Z";
const VEHICLE_LABEL = "▶";
const VEHICLE_ID = "circuitVehicle";

type Props = TrailExampleProps;

export const CircuitExample = (props: Props) => {
    const [getController, setController] = createSignal<TrailController>();

    return (
        <div class={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={CIRCUIT_PATH}
                    size={CIRCUIT_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    progress={props.progress}
                    playback={props.playback}
                    renderTrack={(getPath) => <PageTrailTrack path={getPath} />}
                    renderTraveler={(getPlace) => (
                        <PageTrailVehicle id={VEHICLE_ID} place={getPlace} label={VEHICLE_LABEL} />
                    )}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div class={styles.controls}>
                <Button
                    id={"circuitPlay"}
                    ariaLabel={"Play"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.play} />
                    )}
                    onClick={() => {
                        props.playback[1](true);
                    }}
                />

                <Button
                    id={"circuitPause"}
                    ariaLabel={"Pause"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.pause} />
                    )}
                    onClick={() => {
                        props.playback[1](false);
                    }}
                />

                <Button
                    id={"circuitRewind"}
                    ariaLabel={"Back to start"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.toStart} />
                    )}
                    onClick={() => {
                        getController()?.seek(0);
                    }}
                />
            </div>
        </div>
    );
};
