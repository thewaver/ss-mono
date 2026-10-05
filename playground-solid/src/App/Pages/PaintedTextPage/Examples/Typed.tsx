import { createSignal, createUniqueId } from "solid-js";

import { Button, MediaQueryMonitorSolidUtils, PaintedText, Typewriter } from "@thewaver/ss-components-solid";
import type { AccessorProps, TypewriterController } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextBoxedExampleProps &
    AccessorProps<{
        computeAnimationName: (character: string, index: number, count: number) => string;
    }>;

export const TypedExample = (props: Props) => {
    const id = createUniqueId();

    const [getController, setController] = createSignal<TypewriterController>();

    const [getIsBlinkStopped, setIsBlinkStopped] = createSignal(false);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.fill}>
                    <Typewriter
                        computeAnimationName={props.computeAnimationName}
                        animationDelayMs={() => 40}
                        animationDurationMs={() => 400}
                        renderCaret={() => (
                            <span
                                class={styles.caret}
                                classList={{
                                    [styles.caretBlinking]: !getIsBlinkStopped() && !getPrefersReducedMotion(),
                                }}
                                aria-hidden="true"
                            />
                        )}
                        onMount={setController}
                    >
                        <div class={styles.typedHeading}>
                            <PaintedText
                                computeFillDefs={(getSize, getRef) =>
                                    computeSampleDefs(props, "fill", id, getSize, getRef)
                                }
                                computeStrokeDefs={(getSize, getRef) =>
                                    computeSampleDefs(props, "stroke", id, getSize, getRef)
                                }
                                strokeWidth={props.strokeWidth}
                                strokeAlignment={props.strokeAlignment}
                            >
                                Typed and painted
                            </PaintedText>
                        </div>

                        <div class={styles.paragraph}>
                            <PaintedText
                                computeFillDefs={(getSize, getRef) =>
                                    computeSampleDefs(props, "fill", `${id}-body`, getSize, getRef)
                                }
                                computeStrokeDefs={(getSize, getRef) =>
                                    computeSampleDefs(props, "stroke", `${id}-body`, getSize, getRef)
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

            <div class={styles.buttonRow}>
                <Button
                    id={"typeAgain"}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Type it again</PageButtonContent>}
                    onClick={() => {
                        getController()?.restartAnimation();
                    }}
                />

                <Button
                    id={"toggleBlink"}
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>
                            {getIsBlinkStopped() ? "Start blinking" : "Stop blinking"}
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
