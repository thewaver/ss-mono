import type { Signal } from "solid-js";

import { Range } from "@thewaver/ss-components";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";
import { DefaultExample } from "./Default";

import * as styles from "../CellAnimationPage.css";

const SCRUB_WIDTH = 480;
const PERCENT = 100;
const SLIDER_STEP = 1;

type Props = CellAnimationSourcedExampleProps & {
    progressSignal: Signal<number>;
};

export const ScrubExample = (props: Props) => {
    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => SCRUB_WIDTH}>
                <DefaultExample {...props} />
            </PageMeasureBox>

            <Range
                id={"cellAnimationScrubber"}
                sizing={"fill"}
                ariaLabel={"Position in the pass"}
                min={() => 0}
                max={() => PERCENT}
                step={() => SLIDER_STEP}
                valueSignal={[
                    () => Math.round(props.progressSignal[0]() * PERCENT),
                    (value: number) => props.progressSignal[1](value / PERCENT),
                ]}
                renderContent={(getRenderProps) => (
                    <PageRangeContent renderProps={getRenderProps} length={() => SCRUB_WIDTH} />
                )}
            />
        </div>
    );
};
