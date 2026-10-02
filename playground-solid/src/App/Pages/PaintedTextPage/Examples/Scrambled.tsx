import { createSignal, createUniqueId } from "solid-js";

import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-solid";
import type { ScrambleTextController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

export const ScrambledExample = (props: PaintedTextExampleProps) => {
    const id = createUniqueId();

    const [getController, setController] = createSignal<ScrambleTextController>();

    return (
        <div class={styles.stack}>
            <div class={`${styles.fill} ${styles.typedHeading}`}>
                <ScrambleText settleDurationMs={() => 1800} onMount={setController}>
                    <PaintedText
                        computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                        computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        Build 1.4.3 ready
                    </PaintedText>
                </ScrambleText>
            </div>

            <Button
                id={"scrambleAgain"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Scramble it again</PageButtonContent>}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};
