import { useId } from "react";

import { Button, PaintedText, PaintedTextUtils } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextCircleExampleProps } from "../PaintedTextPage.types";

const RING_TEXT = "PAINTED TEXT • ROUND A CIRCLE • ";

type Props = PaintedTextCircleExampleProps;

export const CircleExample = (props: Props) => {
    const id = useId();

    const path = PaintedTextUtils.computeCirclePath({ x: props.radius, y: props.radius }, props.radius);

    return (
        <div className={styles.stack}>
            <PageMeasureBox padding={MEASURE_BOX_PADDING}>
                <div className={styles.ringText}>
                    <PaintedText
                        path={path}
                        isFittedToPath={props.isFittedToPath}
                        lapDurationMs={props.lapDurationMs}
                        progress={props.progress}
                        playback={props.playback}
                        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                        computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        {RING_TEXT}
                    </PaintedText>
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"circlePlayback"}
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
