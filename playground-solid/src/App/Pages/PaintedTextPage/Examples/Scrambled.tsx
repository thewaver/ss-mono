import { createSignal, createUniqueId } from "solid-js";

import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-solid";
import type { ScrambleTextController } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

export const ScrambledExample = (props: PaintedTextBoxedExampleProps) => {
    const id = createUniqueId();

    const [getController, setController] = createSignal<ScrambleTextController>();

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <div class={`${styles.fill} ${styles.typedHeading}`}>
                    <ScrambleText settleDurationMs={() => 1800} onMount={setController}>
                        <PaintedText
                            computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                            computeStrokeDefs={(getSize, getRef) =>
                                computeSampleDefs(props, "stroke", id, getSize, getRef)
                            }
                            strokeWidth={props.strokeWidth}
                            strokeAlignment={props.strokeAlignment}
                        >
                            Build 1.4.3 ready
                        </PaintedText>
                    </ScrambleText>
                </div>
            </PageMeasureBox>

            <Button
                id={"scrambleAgain"}
                ariaLabel={"Scramble it again"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.replay} />
                )}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};
