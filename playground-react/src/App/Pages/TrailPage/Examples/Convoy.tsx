import { useState } from "react";

import { Button, Trail } from "@thewaver/ss-components-react";
import type { TrailController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageTrailTrack, PageTrailVehicle } from "../../../StyledComponents/TrailContent/TrailContent";
import type { TrailExampleProps } from "../TrailPage.types";

const CONVOY_SIZE = { width: 320, height: 150 };
const CONVOY_PATH = "M 30 120 C 80 120, 90 30, 160 30 S 240 120, 290 120";
const CONVOY_OFFSETS = [0, 0.12, 0.24, 0.36];
const LEAD_LABEL = "▶";

type Props = TrailExampleProps;

export const ConvoyExample = (props: Props) => {
    const [controller, setController] = useState<TrailController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox>
                <Trail
                    path={CONVOY_PATH}
                    size={CONVOY_SIZE}
                    durationMs={props.durationMs}
                    isLooping={props.isLooping}
                    isTurning={props.isTurning}
                    followerOffsets={CONVOY_OFFSETS}
                    progress={props.progress}
                    playback={props.playback}
                    renderTrack={(path) => <PageTrailTrack path={path} />}
                    renderTraveler={(place, index) => (
                        <PageTrailVehicle
                            id={`convoyVehicle${index}`}
                            place={place}
                            label={index === 0 ? LEAD_LABEL : `${index}`}
                        />
                    )}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div className={styles.controls}>
                <Button
                    id={"convoyPlayback"}
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
                    id={"convoyRewind"}
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
