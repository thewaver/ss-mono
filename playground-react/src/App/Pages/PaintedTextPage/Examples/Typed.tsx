import { useId, useState } from "react";

import { Button, MediaQueryMonitorReactUtils, PaintedText, Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps & {
    animationName: string;
};

export const TypedExample = (props: Props) => {
    const id = useId();

    const [controller, setController] = useState<TypewriterController>();

    const [isBlinkStopped, setIsBlinkStopped] = useState(false);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    return (
        <div className={styles.stack}>
            <div className={styles.fill}>
                <Typewriter
                    animationName={props.animationName}
                    animationDelayMs={40}
                    animationDurationMs={400}
                    renderCaret={() => (
                        <span
                            className={[styles.caret, !isBlinkStopped && !prefersReducedMotion && styles.caretBlinking]
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
                            computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
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
