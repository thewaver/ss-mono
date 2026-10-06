import { createUniqueId } from "solid-js";

import { Button, PaintedText } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextPathExampleProps } from "../PaintedTextPage.types";

const WAVE_PATH = "M 0 60 C 45 0 90 0 135 60 S 225 120 270 60 S 360 0 405 60 S 495 120 540 60";
const WAVE_TEXT = "Riding the wave, round and round • ";

type Props = PaintedTextPathExampleProps;

export const WaveExample = (props: Props) => {
    const id = createUniqueId();

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.waveText}>
                    <PaintedText
                        path={WAVE_PATH}
                        lapDurationMs={props.lapDurationMs}
                        progress={props.progress}
                        playback={props.playback}
                        computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                        computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        {WAVE_TEXT}
                    </PaintedText>
                </div>
            </PageMeasureBox>

            <div class={styles.buttonRow}>
                <Button
                    id={"wavePlayback"}
                    ariaLabel={() => (props.playback[0]() ? "Pause" : "Play")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (props.playback[0]() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        props.playback[1](!props.playback[0]());
                    }}
                />
            </div>
        </div>
    );
};
