import { useState } from "react";

import { Button, Trail } from "@thewaver/ss-components-react";
import type { TrailController } from "@thewaver/ss-components-react";
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
                    progress={props.progress}
                    playback={props.playback}
                    renderTrack={(path) => <PageTrailTrack path={path} />}
                    renderTraveler={(place) => <PageTrailVehicle id={VEHICLE_ID} place={place} label={VEHICLE_LABEL} />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div className={styles.controls}>
                <Button
                    id={"circuitPlayback"}
                    ariaLabel={props.playback[0] ? "Pause" : "Play"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={props.playback[0] ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                        />
                    )}
                    onClick={() => {
                        props.playback[1](!props.playback[0]);
                    }}
                />

                <Button
                    id={"circuitRewind"}
                    ariaLabel={"Back to start"}
                    renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.toStart} />}
                    onClick={() => {
                        controller?.seek(0);
                    }}
                />
            </div>
        </div>
    );
};
