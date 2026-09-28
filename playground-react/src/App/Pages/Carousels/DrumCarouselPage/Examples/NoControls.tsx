import { DrumCarousel } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <DrumCarousel
            slides={props.slides}
            indexState={props.indexState}
            isDisabled={props.isDisabled}
            axis={props.axis}
            slideSize={SLIDE_SIZE}
            ariaLabel={"Bare barrel sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
            renderSlideBack={() => <PageCarouselSlideBack />}
        />
    );
};
