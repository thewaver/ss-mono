import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, Range } from "@thewaver/ss-components-solid";
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
import type { ArrowBedDocsExampleProps } from "../TooltipPageSolid.types";

type Props = ArrowBedDocsExampleProps;

export const CirclingDocsExample = (props: Props) => {
    const degrees = createSignal(STARTING_CIRCLING_DEGREES);

    const [getSliderRef, setSliderRef] = createSignal<HTMLElement>();

    const getSliderSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getSliderRef);

    return (
        <div class={styles.circlingStage}>
            <ArrowBedTooltip
                arrow={props.arrow}
                arrowWidth={props.arrowWidth}
                arrowLength={props.arrowLength}
                shape={props.shape}
                computeAim={(size) => computeCirclingAim(degrees[0](), size)}
                label={() => `${degrees[0]()}°`}
            />

            <div ref={setSliderRef} class={styles.circlingSlider}>
                <Range
                    id={"circlingDegrees"}
                    value={degrees}
                    min={CIRCLING_MIN_DEGREES}
                    max={CIRCLING_MAX_DEGREES}
                    step={CIRCLING_STEP_DEGREES}
                    sizing={"fill"}
                    thumbSize={RANGE_THUMB_SIZE}
                    ariaLabel={"Where the arrow sits round the tooltip"}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => getSliderSize().width} />
                    )}
                />
            </div>
        </div>
    );
};
