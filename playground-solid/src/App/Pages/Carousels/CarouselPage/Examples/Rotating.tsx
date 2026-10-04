import { Carousel, access } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselRotation,
    PageCarouselStep,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

const CAROUSEL_GAP = 10;

type Props = CarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderRotationControl()}
        {controls.renderStep("previous")}
        {Array.from({ length: controls.getCount() }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const RotatingExample = (props: Props) => {
    return (
        <Carousel
            computePlacement={props.computePlacement}
            slides={props.slides}
            index={props.index}
            playback={props.playback}
            isDisabled={props.isDisabled}
            isLooping={props.isLooping}
            orientation={props.orientation}
            autoplayDelayMs={props.autoplayDelayMs}
            gap={() => CAROUSEL_GAP}
            ariaLabel={"Rotating sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(getSlide, getState) => (
                <SlideFront title={getSlide()} state={getState} frameClass={() => access(props.frameClasses).front} />
            )}
            renderSlideBack={() => <SlideBack frameClass={() => access(props.frameClasses).back} />}
            renderStep={(_getStep, getRenderProps) => <PageCarouselStep renderProps={getRenderProps} />}
            renderPick={(_getIndex, getRenderProps) => <PageCarouselPick renderProps={getRenderProps} />}
            renderRotationControl={(getFlags) => <PageCarouselRotation flags={getFlags} />}
            renderControls={renderBar}
        />
    );
};
