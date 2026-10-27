import { useState } from "react";

import { Range } from "@thewaver/ss-components-react";
import {
    CIRCLING_MAX_DEGREES,
    CIRCLING_MIN_DEGREES,
    CIRCLING_STEP_DEGREES,
    STARTING_CIRCLING_DEGREES,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeCirclingAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { ArrowBedTooltip } from "../ArrowBedTooltip";
import type { ArrowBedDocsExampleProps } from "../TooltipPageReact.types";

type Props = ArrowBedDocsExampleProps;

export const CirclingDocsExample = (props: Props) => {
    const degrees = useState(STARTING_CIRCLING_DEGREES);

    return (
        <div className={styles.circlingStage}>
            <ArrowBedTooltip
                arrow={props.arrow}
                arrowWidth={props.arrowWidth}
                arrowLength={props.arrowLength}
                shape={props.shape}
                computeAim={(size) => computeCirclingAim(degrees[0], size)}
                label={`${degrees[0]}°`}
            />

            <div className={styles.circlingSlider}>
                <Range
                    id={"circlingDegrees"}
                    value={degrees}
                    min={CIRCLING_MIN_DEGREES}
                    max={CIRCLING_MAX_DEGREES}
                    step={CIRCLING_STEP_DEGREES}
                    sizing={"fill"}
                    thumbSize={RANGE_THUMB_SIZE}
                    ariaLabel={"Where the arrow sits round the tooltip"}
                    renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
                />
            </div>
        </div>
    );
};
