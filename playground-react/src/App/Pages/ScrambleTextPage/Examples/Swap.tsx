import { useState } from "react";

import { Button, ScrambleText } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORIZED", "STREAMING", "IDLE"];
const BOX_WIDTH = 320;
const FIRST_STATUS = 0;

type Props = ScrambleTextExampleProps;

export const SwapExample = (props: Props) => {
    const [statusIndex, setStatusIndex] = useState(FIRST_STATUS);

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                <div className={styles.headline}>
                    <ScrambleText
                        text={STATUSES[statusIndex]}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"nextStatus"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Next status</PageButtonContent>}
                onClick={() => {
                    setStatusIndex((index) => (index + 1) % STATUSES.length);
                }}
            />
        </div>
    );
};
