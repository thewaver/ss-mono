import { createUniqueId } from "solid-js";

import { Button, PaintedText, PaintedTextUtils, access } from "@thewaver/ss-components-solid";
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
    const id = createUniqueId();

    const getPath = () => {
        const radius = access(props.radius);

        return PaintedTextUtils.computeCirclePath({ x: radius, y: radius }, radius);
    };

    return (
        <div class={styles.stack}>
            <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.ringText}>
                    <PaintedText
                        path={getPath}
                        isFittedToPath={props.isFittedToPath}
                        lapDurationMs={props.lapDurationMs}
                        progress={props.progress}
                        playback={props.playback}
                        computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                        computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        {RING_TEXT}
                    </PaintedText>
                </div>
            </PageMeasureBox>

            <div class={styles.buttonRow}>
                <Button
                    id={"circlePlayback"}
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
