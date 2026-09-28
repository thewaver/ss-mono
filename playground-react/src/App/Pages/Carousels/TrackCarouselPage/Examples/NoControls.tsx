import { TrackCarousel } from "@thewaver/ss-components-react";
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
            indexState={props.indexState}
            isDisabled={props.isDisabled}
            orientation={props.orientation}
            ariaLabel={"Bare sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
        />
    );
};
