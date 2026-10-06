import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORIZED", "STREAMING", "IDLE"];
const BOX_WIDTH = 320;
const FIRST_STATUS = 0;

type Props = ScrambleTextExampleProps;

export const SwapExample = (props: Props) => {
    const [getStatusIndex, setStatusIndex] = createSignal(FIRST_STATUS);

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.headline}>
                    <ScrambleText
                        text={() => STATUSES[getStatusIndex()]}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"nextStatus"}
                ariaLabel={"Next status"}
                renderContent={(getFlags) => <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.next} />}
                onClick={() => {
                    setStatusIndex((index) => (index + 1) % STATUSES.length);
                }}
            />
        </div>
    );
};
