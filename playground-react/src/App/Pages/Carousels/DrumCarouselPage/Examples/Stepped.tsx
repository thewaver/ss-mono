import { DrumCarousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselSlide,
    PageCarouselSlideBack,
    PageCarouselStep,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const CAROUSEL_GAP = 10;
const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderStep("previous")}
        {Array.from({ length: controls.count }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const SteppedExample = (props: Props) => {
    return (
        <DrumCarousel
            slides={props.slides}
            index={props.index}
            isDisabled={props.isDisabled}
            axis={props.axis}
            slideSize={SLIDE_SIZE}
            gap={CAROUSEL_GAP}
            ariaLabel={"Barrel sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
            renderSlideBack={() => <PageCarouselSlideBack />}
            renderStep={(_step, renderProps) => <PageCarouselStep renderProps={renderProps} />}
            renderPick={(_index, renderProps) => <PageCarouselPick renderProps={renderProps} />}
            renderControls={renderBar}
        />
    );
};
