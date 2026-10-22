import { onCleanup } from "solid-js";

import { Carousel, access } from "@thewaver/ss-components-solid";
import type { CarouselControls } from "@thewaver/ss-components-solid";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { WINDOWED_SLIDE_COUNT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { TITLES } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import { PageCarouselBar, PageCarouselStep } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

const CAROUSEL_GAP = 10;

const BUILT = 1;

const SLIDES = Array.from(
    { length: WINDOWED_SLIDE_COUNT },
    (_, index) => `${TITLES[index % TITLES.length]} ${index + 1}`,
);

type Props = Omit<CarouselExampleProps, "slides"> & {
    onBuiltChange: (change: number) => void;
};

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderStep("previous")}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const WindowedExample = (props: Props) => {
    return (
        <Carousel
            placement={props.placement}
            slides={SLIDES}
            index={props.index}
            isDisabled={props.isDisabled}
            isLooping={props.isLooping}
            isWindowed={true}
            orientation={props.orientation}
            transitionDurationMs={props.transitionDurationMs}
            gap={CAROUSEL_GAP}
            ariaLabel={"A hundred slides"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(getSlide, getState) => {
                props.onBuiltChange(BUILT);

                onCleanup(() => props.onBuiltChange(-BUILT));

                return (
                    <SlideFront
                        title={getSlide()}
                        state={getState}
                        frameClass={() => access(props.frameClasses).front}
                    />
                );
            }}
            renderSlideBack={() => <SlideBack frameClass={() => access(props.frameClasses).back} />}
            renderStep={(_getStep, getRenderProps) => <PageCarouselStep renderProps={getRenderProps} />}
            renderControls={renderBar}
        />
    );
};
