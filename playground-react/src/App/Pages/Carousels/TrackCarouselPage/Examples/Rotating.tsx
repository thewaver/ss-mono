import { TrackCarousel } from "@thewaver/ss-components-react";
import type { CarouselControls } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

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
        {Array.from({ length: controls.count }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </PageCarouselBar>
);

export const RotatingExample = (props: Props) => {
    return (
        <TrackCarousel
            slides={props.slides}
            indexState={props.indexState}
            playbackState={props.playbackState}
            isDisabled={props.isDisabled}
            isLooping={props.isLooping}
            orientation={props.orientation}
            autoplayDelayMs={props.autoplayDelayMs}
            gap={CAROUSEL_GAP}
            ariaLabel={"Rotating sampler"}
            computeSlideLabel={computePositionLabel}
            computeStepLabel={computeCarouselStepLabel}
            computeRotationLabel={computeCarouselRotationLabel}
            renderSlide={(slide, state) => <PageCarouselSlide state={state}>{slide}</PageCarouselSlide>}
            renderStep={(_step, renderProps) => <PageCarouselStep renderProps={renderProps} />}
            renderPick={(_index, renderProps) => <PageCarouselPick renderProps={renderProps} />}
            renderRotationControl={(flags) => <PageCarouselRotation flags={flags} />}
            renderControls={renderBar}
        />
    );
};
