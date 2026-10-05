import { useId, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, PaintedText, Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterController } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextBoxedExampleProps & {
    computeAnimationName: (character: string, index: number, count: number) => string;
};

export const TypedExample = (props: Props) => {
    const id = useId();

    const [controller, setController] = useState<TypewriterController>();

    const [isBlinkStopped, setIsBlinkStopped] = useState(false);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <div className={styles.fill}>
                    <Typewriter
                        computeAnimationName={props.computeAnimationName}
                        animationDelayMs={40}
                        animationDurationMs={400}
                        renderCaret={() => (
                            <span
                                className={[
                                    styles.caret,
                                    !isBlinkStopped && !prefersReducedMotion && styles.caretBlinking,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                aria-hidden="true"
                            />
                        )}
                        onMount={setController}
                    >
                        <div className={styles.typedHeading}>
                            <PaintedText
                                computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                                computeStrokeDefs={(size, element) =>
                                    computeSampleDefs(props, "stroke", id, size, element)
                                }
                                strokeWidth={props.strokeWidth}
                                strokeAlignment={props.strokeAlignment}
                            >
                                Typed and painted
                            </PaintedText>
                        </div>

                        <div className={styles.paragraph}>
                            <PaintedText
                                computeFillDefs={(size, element) =>
                                    computeSampleDefs(props, "fill", `${id}-body`, size, element)
                                }
                                computeStrokeDefs={(size, element) =>
                                    computeSampleDefs(props, "stroke", `${id}-body`, size, element)
                                }
                                strokeWidth={props.strokeWidth}
                                strokeAlignment={props.strokeAlignment}
                            >
                                The heading types first, then this line carries on from where it ended.
                            </PaintedText>
                        </div>
                    </Typewriter>
                </div>
            </PageMeasureBox>

            <div className={styles.buttonRow}>
                <Button
                    id={"typeAgain"}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Type it again</PageButtonContent>}
                    onClick={() => {
                        controller?.restartAnimation();
                    }}
                />

                <Button
                    id={"toggleBlink"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>
                            {isBlinkStopped ? "Start blinking" : "Stop blinking"}
                        </PageButtonContent>
                    )}
                    onClick={() => {
                        setIsBlinkStopped((isStopped) => !isStopped);
                    }}
                />
            </div>
        </div>
    );
};
