import { useId } from "react";

import { Button, PaintedText, PaintedTextUtils } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
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
            </div>
        </div>
    );
};
