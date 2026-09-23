import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

import { MEASURE_BOX_PADDING } from "../../../PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "../ScrambleTextPage.css";

const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORISED", "STREAMING", "IDLE"];
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
                        glyphs={props.glyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"nextStatus"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Next status</PageButtonContent>}
                onClick={() => {
                    setStatusIndex((index) => (index + 1) % STATUSES.length);
                }}
            />
        </div>
    );
};
