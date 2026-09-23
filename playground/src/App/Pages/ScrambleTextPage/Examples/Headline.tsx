import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components";
import type { ScrambleTextController } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

import { MEASURE_BOX_PADDING } from "../../../PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "../ScrambleTextPage.css";

const HEADLINE = "SYSTEM ONLINE";
const BOX_WIDTH = 320;

type Props = ScrambleTextExampleProps;

export const HeadlineExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrambleTextController>();

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.headline}>
                    <ScrambleText
                        text={HEADLINE}
                        glyphs={props.glyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"runItAgain"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Run it again</PageButtonContent>}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};
