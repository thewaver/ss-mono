import { Carousel, access } from "@thewaver/ss-components-solid";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import type { CarouselExampleProps } from "../../Carousels.types";
import { SlideBack, SlideFront } from "./Slide";

type Props = CarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <Carousel
            computePlacement={props.computePlacement}
            slides={props.slides}
            index={props.index}
            isDisabled={props.isDisabled}
            orientation={props.orientation}
            ariaLabel={"Bare sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(getSlide, getState) => (
                <SlideFront title={getSlide()} state={getState} frameClass={() => access(props.frameClasses).front} />
            )}
            renderSlideBack={() => <SlideBack frameClass={() => access(props.frameClasses).back} />}
        />
    );
};
