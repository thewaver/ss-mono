import { createSignal, createUniqueId } from "solid-js";

import { Button, MediaQueryMonitorSolidUtils, PaintedText, Typewriter } from "@thewaver/ss-components-solid";
import type { AccessorProps, TypewriterController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps &
    AccessorProps<{
        animationName: string;
    }>;

export const TypedExample = (props: Props) => {
    const id = createUniqueId();

    const [getController, setController] = createSignal<TypewriterController>();

    const [getIsBlinkStopped, setIsBlinkStopped] = createSignal(false);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    return (
        <div class={styles.stack}>
            <div class={styles.fill}>
                <Typewriter
                    animationName={props.animationName}
                    animationDelayMs={() => 40}
                    animationDurationMs={() => 400}
                    renderCaret={() => (
                        <span
                            class={styles.caret}
                            classList={{ [styles.caretBlinking]: !getIsBlinkStopped() && !getPrefersReducedMotion() }}
                            aria-hidden="true"
                        />
                    )}
                    onMount={setController}
                >
                    <div class={styles.typedHeading}>
                        <PaintedText
                            computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
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
