import { useState } from "react";

import { Button, ScrambleText } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const BUILDS = ["Build 1.4.2 ready", "Build 1.4.3 ready", "Build 1.4.3 RC1 ready", "Build 1.5.0 ready"];
const BOX_WIDTH = 320;
const FIRST_BUILD = 0;

type Props = ScrambleTextExampleProps;

export const ChangedOnlyExample = (props: Props) => {
    const [buildIndex, setBuildIndex] = useState(FIRST_BUILD);

    return (
        <div className={styles.stack}>
            <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
                <div className={styles.headline}>
                    <ScrambleText
                        text={BUILDS[buildIndex]}
                        changedOnly={true}
                        computeGlyphs={props.computeGlyphs}
                        settleDurationMs={props.settleDurationMs}
                        scrambleIntervalMs={props.scrambleIntervalMs}
                        computeCharacterWeights={props.computeCharacterWeights}
                    />
                </div>
            </PageMeasureBox>

            <Button
                id={"nextBuild"}
                ariaLabel={"Next build"}
                renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.next} />}
                onClick={() => {
                    setBuildIndex((index) => (index + 1) % BUILDS.length);
                }}
            />
        </div>
    );
};
