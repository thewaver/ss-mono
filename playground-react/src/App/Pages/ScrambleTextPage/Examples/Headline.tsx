import { useState } from "react";

import { Button, ScrambleText } from "@thewaver/ss-components-react";
import type { ScrambleTextController } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground-core/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const HEADLINE = "SYSTEM ONLINE";
const BOX_WIDTH = 320;

type Props = ScrambleTextExampleProps;

export const HeadlineExample = (props: Props) => {
    const [controller, setController] = useState<ScrambleTextController>();

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                <div className={styles.headline}>
                    <ScrambleText
                        text={HEADLINE}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                        onMount={setController}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"runItAgain"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Run it again</PageButtonContent>}
                onClick={() => {
                    controller?.restartAnimation();
                }}
            />
        </div>
    );
};
