import { useId } from "react";

import { Button, PaintedText } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextPathExampleProps } from "../PaintedTextPage.types";

const WAVE_PATH = "M 0 60 C 45 0 90 0 135 60 S 225 120 270 60 S 360 0 405 60 S 495 120 540 60";
const WAVE_TEXT = "Riding the wave, round and round • ";

type Props = PaintedTextPathExampleProps;

export const WaveExample = (props: Props) => {
    const id = useId();

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <div className={styles.waveText}>
                    <PaintedText
                        path={WAVE_PATH}
                        lapDurationMs={props.lapDurationMs}
                        progress={props.progress}
                        playback={props.playback}
                        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                        computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        {WAVE_TEXT}
                    </PaintedText>
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"wavePlayback"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{props.playback[0] ? "Pause" : "Play"}</PageButtonContent>
                    )}
                    onClick={() => {
                        props.playback[1](!props.playback[0]);
                    }}
                />
            </div>
        </div>
    );
};
