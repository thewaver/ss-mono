import { useState } from "react";

import type { CarouselAxis, CarouselStep } from "@thewaver/ss-components";

import { type CarouselControls, DrumCarousel } from "../../src";

const TITLES = ["Aurora", "Basalt", "Cinder", "Drift"];
const STEP_LABELS: Record<CarouselStep, string> = { previous: "Previous slide", next: "Next slide" };
const SLIDE_SIZE = { width: 260, height: 140 };

const computeSlideLabel = (index: number, count: number) => `${index + 1} of ${count}`;
const computeStepLabel = (step: CarouselStep) => STEP_LABELS[step];
const computeRotationLabel = (isPlaying: boolean) =>
    isPlaying ? "Stop automatic slide show" : "Start automatic slide show";

const renderControls = (controls: CarouselControls) => (
    <div>
        {controls.renderStep("previous")}
        {Array.from({ length: controls.count }, (_, index) => controls.renderPick(index))}
        {controls.renderStep("next")}
    </div>
);

export const Default = ({ axis }: { axis?: CarouselAxis }) => {
    const indexState = useState(0);

    return (
        <>
            <DrumCarousel
                slides={TITLES}
                indexState={indexState}
                axis={axis}
                slideSize={SLIDE_SIZE}
                gap={10}
                ariaLabel="Barrel sampler"
                computeSlideLabel={computeSlideLabel}
                computeStepLabel={computeStepLabel}
                computeRotationLabel={computeRotationLabel}
                renderSlide={(title) => <div>{title}</div>}
                renderSlideBack={() => <div />}
                renderStep={(step) => <span>{step === "previous" ? "Back" : "On"}</span>}
                renderPick={(index) => <span>{index + 1}</span>}
                renderControls={renderControls}
            />
            <output data-readout="index">{indexState[0]}</output>
        </>
    );
};
