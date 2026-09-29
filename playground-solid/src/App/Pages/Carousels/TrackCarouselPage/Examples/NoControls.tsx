import { TrackCarousel } from "@thewaver/ss-components-solid";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";

type Props = CarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <TrackCarousel
            slides={props.slides}
            index={props.index}
            isDisabled={props.isDisabled}
            orientation={props.orientation}
            ariaLabel={"Bare sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
        />
    );
};
