import { TrackCarousel } from "@thewaver/ss-components";
import type { CarouselControls } from "@thewaver/ss-components";

import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "../../../../PageComponents/Announcements/Announcements.const";
import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselRotation,
    PageCarouselSlide,
    PageCarouselStep,
} from "../../../../StyledComponents/CarouselContent/CarouselContent";
import type { CarouselExampleProps } from "../../Carousels.types";

const CAROUSEL_GAP = 10;

type Props = CarouselExampleProps;

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
        <TrackCarousel
            slides={props.slides}
            indexSignal={props.indexSignal}
            playbackSignal={props.playbackSignal}
            isDisabled={props.isDisabled}
            isLooping={props.isLooping}
            orientation={props.orientation}
            autoplayDelayMs={props.autoplayDelayMs}
            gap={() => CAROUSEL_GAP}
            ariaLabel={"Rotating sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(getSlide, getState) => <PageCarouselSlide state={getState}>{getSlide()}</PageCarouselSlide>}
            renderStep={(_getStep, getRenderProps) => <PageCarouselStep renderProps={getRenderProps} />}
            renderPick={(_getIndex, getRenderProps) => <PageCarouselPick renderProps={getRenderProps} />}
            renderRotationControl={(getFlags) => <PageCarouselRotation flags={getFlags} />}
            renderControls={renderBar}
        />
    );
};
