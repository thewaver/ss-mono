import { TrackCarousel } from "@thewaver/ss-components";
import type { CarouselControls } from "@thewaver/ss-components";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselSlide,
    PageCarouselStep,
} from "../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../CarouselPage.types";

const CAROUSEL_GAP = 10;

type Props = CarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderStep("previous")}
        {Array.from({ length: controls.getCount() }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const SteppedExample = (props: Props) => {
    return (
        <TrackCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            isDisabled={props.isDisabled}
            dir={props.dir}
            gap={() => CAROUSEL_GAP}
            ariaLabel={"Sampler"}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
            renderStep={(_getStep, getFlags) => <PageCarouselStep flags={getFlags} />}
            renderPick={(_getIndex, getFlags) => <PageCarouselPick flags={getFlags} />}
            renderControls={renderBar}
        />
    );
};
