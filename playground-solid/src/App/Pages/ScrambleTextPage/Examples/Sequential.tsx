import { createSignal } from "solid-js";

import { Button, ScrambleText, access } from "@thewaver/ss-components-solid";
import type { ScrambleTextController } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
const BOX_WIDTH = 320;
const SINGLE_CHARACTER = 1;
const ROLLS_PER_CHARACTER = 6;
const RUN_MULTIPLIER = 4;
const MIN_INTERVAL_MS = 12;

type Props = ScrambleTextExampleProps;

export const SequentialExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrambleTextController>();

    const getRunDurationMs = () => access(props.settleDurationMs) * RUN_MULTIPLIER;

    const getChurnDurationMs = () => getRunDurationMs() / Math.max(LINE.length - SINGLE_CHARACTER, SINGLE_CHARACTER);

    const getScrambleIntervalMs = () => Math.max(getChurnDurationMs() / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS);

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.headline}>
                    <ScrambleText
                        text={LINE}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={getRunDurationMs}
                        churnDurationMs={getChurnDurationMs}
                        scrambleIntervalMs={getScrambleIntervalMs}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"revealAgain"}
                ariaLabel={"Reveal again"}
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
