import { DrumCarousel } from "@thewaver/ss-components";
import type { CarouselControls } from "@thewaver/ss-components";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselSlide,
    PageCarouselSlideBack,
    PageCarouselStep,
} from "../../../StyledComponents/CarouselContent/CarouselContent";
import type { DrumCarouselExampleProps } from "../CarouselPage.types";

const CAROUSEL_GAP = 10;
const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderStep("previous")}
        {Array.from({ length: controls.getCount() }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const DrumExample = (props: Props) => {
    return (
        <DrumCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            isDisabled={props.isDisabled}
            axis={props.axis}
            slideSize={() => SLIDE_SIZE}
            gap={() => CAROUSEL_GAP}
            ariaLabel={"Barrel sampler"}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
            renderSlideBack={() => <PageCarouselSlideBack />}
            renderStep={(_getStep, getRenderProps) => <PageCarouselStep renderProps={getRenderProps} />}
            renderPick={(_getIndex, getRenderProps) => <PageCarouselPick renderProps={getRenderProps} />}
            renderControls={renderBar}
        />
    );
};
