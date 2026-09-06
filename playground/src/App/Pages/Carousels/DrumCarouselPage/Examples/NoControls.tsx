import { DrumCarousel } from "@thewaver/ss-components";

import { PageCarouselSlide, PageCarouselSlideBack } from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <DrumCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            isDisabled={props.isDisabled}
            axis={props.axis}
            slideSize={() => SLIDE_SIZE}
            ariaLabel={"Bare barrel sampler"}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
            renderSlideBack={() => <PageCarouselSlideBack />}
        />
    );
};
