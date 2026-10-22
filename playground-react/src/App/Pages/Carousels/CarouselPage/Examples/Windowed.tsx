import { type ComponentProps, useEffect } from "react";

import { Carousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
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

const CountedSlideFront = (props: ComponentProps<typeof SlideFront> & { onBuiltChange: (change: number) => void }) => {
    const { onBuiltChange, ...slideProps } = props;

    useEffect(() => {
        onBuiltChange(BUILT);

        return () => onBuiltChange(-BUILT);
    }, []);

    return <SlideFront {...slideProps} />;
};

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
            renderSlide={(slide, state) => (
                <CountedSlideFront
                    title={slide}
                    state={state}
                    frameClass={props.frameClasses.front}
                    onBuiltChange={props.onBuiltChange}
                />
            )}
            renderSlideBack={() => <SlideBack frameClass={props.frameClasses.back} />}
            renderStep={(_step, renderProps) => <PageCarouselStep renderProps={renderProps} />}
            renderControls={renderBar}
        />
    );
};
