import { useState } from "react";

import type { CarouselOrientation, CarouselStep } from "@thewaver/ss-components";

import { type CarouselControls, TrackCarousel } from "../../src";

const TITLES = ["Aurora", "Basalt", "Cinder", "Drift"];
const STEP_LABELS: Record<CarouselStep, string> = { previous: "Previous slide", next: "Next slide" };
const BOX_STYLE = { width: "600px", height: "320px" };
const SLIDE_STYLE = { height: "100%", minHeight: "160px" };

const computeSlideLabel = (index: number, count: number) => `${index + 1} of ${count}`;
const computeStepLabel = (step: CarouselStep) => STEP_LABELS[step];
const computeRotationLabel = (isPlaying: boolean) =>
    isPlaying ? "Stop automatic slide show" : "Start automatic slide show";

type DefaultProps = {
    autoplayDelayMs?: number;
    isLooping?: boolean;
    isDisabled?: boolean;
    orientation?: CarouselOrientation;
    hasControls?: boolean;
};

export const Default = ({ autoplayDelayMs, isLooping, isDisabled, orientation, hasControls = true }: DefaultProps) => {
    const indexState = useState(0);
    const playbackState = useState(true);

    const renderControls = (controls: CarouselControls) => (
        <div>
            {autoplayDelayMs !== undefined && controls.renderRotationControl()}
            {controls.renderStep("previous")}
            {Array.from({ length: controls.count }, (_, index) => controls.renderPick(index))}
            {controls.renderStep("next")}
        </div>
    );

    return (
        <>
            <div style={BOX_STYLE}>
                <TrackCarousel
                    slides={TITLES}
                    indexState={indexState}
                    playbackState={playbackState}
                    autoplayDelayMs={autoplayDelayMs}
                    isLooping={isLooping}
                    isDisabled={isDisabled}
                    orientation={orientation}
                    gap={10}
                    ariaLabel="Sampler"
                    computeSlideLabel={computeSlideLabel}
                    computeStepLabel={computeStepLabel}
                    computeRotationLabel={computeRotationLabel}
                    renderSlide={(title) => <div style={SLIDE_STYLE}>{title}</div>}
                    renderStep={(step) => <span>{step === "previous" ? "Back" : "On"}</span>}
                    renderPick={(index, renderProps) => (
                        <span>{renderProps.isCurrent ? `[${index + 1}]` : index + 1}</span>
                    )}
                    renderRotationControl={(flags) => <span>{flags.isPlaying ? "Pause" : "Play"}</span>}
                    renderControls={hasControls ? renderControls : undefined}
                />
            </div>
            <button type="button" data-testid="outside">
                Outside
            </button>
            <output data-readout="index">{indexState[0]}</output>
            <output data-readout="playing">{String(playbackState[0])}</output>
        </>
    );
};
