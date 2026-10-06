import { useId, useState } from "react";

import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-react";
import type { ScrambleTextController } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

export const ScrambledExample = (props: PaintedTextBoxedExampleProps) => {
    const id = useId();

    const [controller, setController] = useState<ScrambleTextController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <div className={`${styles.fill} ${styles.typedHeading}`}>
                    <ScrambleText settleDurationMs={1800} onMount={setController}>
                        <PaintedText
                            computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                            computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
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
                renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.replay} />}
                onClick={() => {
                    controller?.restartAnimation();
                }}
            />
        </div>
    );
};
