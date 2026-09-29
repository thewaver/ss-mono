import { useState } from "react";

import { Button, ScrambleText } from "@thewaver/ss-components-react";
import type { ScrambleTextController } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
const BOX_WIDTH = 320;
const SINGLE_CHARACTER = 1;
const ROLLS_PER_CHARACTER = 6;
const RUN_MULTIPLIER = 4;
const MIN_INTERVAL_MS = 12;

type Props = ScrambleTextExampleProps;

export const SequentialExample = (props: Props) => {
    const [controller, setController] = useState<ScrambleTextController>();

    const runDurationMs = props.settleDurationMs * RUN_MULTIPLIER;

    const churnDurationMs = runDurationMs / Math.max(LINE.length - SINGLE_CHARACTER, SINGLE_CHARACTER);

    const scrambleIntervalMs = Math.max(churnDurationMs / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS);

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                <div className={styles.headline}>
                    <ScrambleText
                        text={LINE}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={runDurationMs}
                        churnDurationMs={churnDurationMs}
                        scrambleIntervalMs={scrambleIntervalMs}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"revealAgain"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Reveal again</PageButtonContent>}
                onClick={() => {
                    controller?.restartAnimation();
                }}
            />
        </div>
    );
};
