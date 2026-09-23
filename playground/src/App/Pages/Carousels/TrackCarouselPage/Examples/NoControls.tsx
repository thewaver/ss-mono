import { TrackCarousel } from "@thewaver/ss-components";

import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "../../../../PageComponents/Announcements/Announcements.const";
import { PageCarouselSlide } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";

type Props = CarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <TrackCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
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
