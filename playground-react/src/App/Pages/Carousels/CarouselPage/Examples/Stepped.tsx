import { Carousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselStep,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

const CAROUSEL_GAP = 10;

type Props = CarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderStep("previous")}
        {Array.from({ length: controls.count }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const SteppedExample = (props: Props) => {
    return (
        <Carousel
            computePlacement={props.computePlacement}
            slides={props.slides}
            index={props.index}
            isDisabled={props.isDisabled}
            isLooping={props.isLooping}
            orientation={props.orientation}
            gap={CAROUSEL_GAP}
            ariaLabel={"Sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(slide, state) => <SlideFront title={slide} state={state} isNarrow={props.isNarrow} />}
            renderSlideBack={() => <SlideBack isNarrow={props.isNarrow} />}
            renderStep={(_step, renderProps) => <PageCarouselStep renderProps={renderProps} />}
            renderPick={(_index, renderProps) => <PageCarouselPick renderProps={renderProps} />}
            renderControls={renderBar}
        />
    );
};
