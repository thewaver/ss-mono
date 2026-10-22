import { type Dispatch, type SetStateAction, useRef } from "react";

import { ElementObserverReactUtils, Range } from "@thewaver/ss-components-react";
import {
    CIRCLING_MAX_DEGREES,
    CIRCLING_MIN_DEGREES,
    CIRCLING_STEP_DEGREES,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeCirclingAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import { useArrowBed } from "../ArrowBed";

type Props = {
    degrees: [number, Dispatch<SetStateAction<number>>];
};

export const CirclingExample = (props: Props) => {
    const arrowBed = useArrowBed();

    const sliderRef = useRef<HTMLDivElement>(null);

    const sliderSize = ElementObserverReactUtils.useBorderBoxSize(sliderRef);

    const [degrees] = props.degrees;

    return (
        <>
            <div className={styles.circlingStage}>
                {arrowBed.renderTooltip((size) => computeCirclingAim(degrees, size), `${degrees}°`)}

                <div ref={sliderRef} className={styles.circlingSlider}>
                    <Range
                        value={props.degrees}
                        min={CIRCLING_MIN_DEGREES}
                        max={CIRCLING_MAX_DEGREES}
                        step={CIRCLING_STEP_DEGREES}
                        sizing={"fill"}
                        thumbSize={RANGE_THUMB_SIZE}
                        ariaLabel={"Where the arrow sits round the tooltip"}
                        renderContent={(renderProps) => (
                            <PageRangeContent renderProps={renderProps} length={sliderSize.width} />
                        )}
                    />
                </div>
            </div>

            <PageExampleKnobs>{arrowBed.renderKnobs()}</PageExampleKnobs>
        </>
    );
};
