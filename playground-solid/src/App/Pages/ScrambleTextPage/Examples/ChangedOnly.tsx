import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

const BUILDS = ["Build 1.4.2 ready", "Build 1.4.3 ready", "Build 1.4.3 RC1 ready", "Build 1.5.0 ready"];
const BOX_WIDTH = 320;
const FIRST_BUILD = 0;

type Props = ScrambleTextExampleProps;

export const ChangedOnlyExample = (props: Props) => {
    const [getBuildIndex, setBuildIndex] = createSignal(FIRST_BUILD);

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => BOX_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.headline}>
                    <ScrambleText
                        text={() => BUILDS[getBuildIndex()]}
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
                renderContent={(getFlags) => <PageControlButtonContent flags={getFlags}>Next</PageControlButtonContent>}
                onClick={() => {
                    setBuildIndex((index) => (index + 1) % BUILDS.length);
                }}
            />
        </div>
    );
};
