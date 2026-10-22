import { type Signal, createSignal } from "solid-js";

import { ElementObserverSolidUtils, Range } from "@thewaver/ss-components-solid";
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
import { createArrowBed } from "../ArrowBed";

type Props = {
    degrees: Signal<number>;
};

export const CirclingExample = (props: Props) => {
    const arrowBed = createArrowBed();

    const [getSliderRef, setSliderRef] = createSignal<HTMLElement>();

    const getSliderSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getSliderRef);

    return (
        <>
            <div class={styles.circlingStage}>
                {arrowBed.renderTooltip(
                    (size) => computeCirclingAim(props.degrees[0](), size),
                    () => `${props.degrees[0]()}°`,
                )}

                <div ref={setSliderRef} class={styles.circlingSlider}>
                    <Range
                        value={props.degrees}
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

            <PageExampleKnobs>{arrowBed.renderKnobs()}</PageExampleKnobs>
        </>
    );
};
