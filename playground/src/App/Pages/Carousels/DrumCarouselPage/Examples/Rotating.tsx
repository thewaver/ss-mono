import { DrumCarousel } from "@thewaver/ss-components";
import type { CarouselControls } from "@thewaver/ss-components";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselRotation,
    PageCarouselSlide,
    PageCarouselSlideBack,
    PageCarouselStep,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { DrumCarouselExampleProps } from "../../Carousels.types";

const CAROUSEL_GAP = 10;
const SLIDE_SIZE = { width: 260, height: 140 };

type Props = DrumCarouselExampleProps;

const renderBar = (controls: CarouselControls) => (
    <PageCarouselBar>
        {controls.renderRotationControl()}
        {controls.renderStep("previous")}
        {Array.from({ length: controls.getCount() }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const RotatingExample = (props: Props) => {
    return (
        <DrumCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            playingSignal={props.playingSignal}
            isDisabled={props.isDisabled}
            axis={props.axis}
            autoplayDelayMs={props.autoplayDelayMs}
            slideSize={() => SLIDE_SIZE}
            gap={() => CAROUSEL_GAP}
            ariaLabel={"Rotating barrel sampler"}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
            renderSlideBack={() => <PageCarouselSlideBack />}
            renderStep={(_getStep, getRenderProps) => <PageCarouselStep renderProps={getRenderProps} />}
            renderPick={(_getIndex, getRenderProps) => <PageCarouselPick renderProps={getRenderProps} />}
            renderRotationControl={(getFlags) => <PageCarouselRotation flags={getFlags} />}
            renderControls={renderBar}
        />
    );
};
