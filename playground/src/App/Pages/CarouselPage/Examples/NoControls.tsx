import { TrackCarousel } from "@thewaver/ss-components";

import { PageCarouselSlide } from "../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../CarouselPage.types";

type Props = CarouselExampleProps;

export const NoControlsExample = (props: Props) => {
    return (
        <TrackCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            isDisabled={props.isDisabled}
            dir={props.dir}
            ariaLabel={"Bare sampler"}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
        />
    );
};
