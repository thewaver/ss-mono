import { useEffect, useRef, useSyncExternalStore } from "react";

import { Button, ButtonStyles, InteractionTrackerReactUtils, InteractionWrapper } from "@thewaver/ss-components-react";
import type { CarouselControls, CarouselStep } from "@thewaver/ss-components-react";
import {
    computeCarouselRotationLabel,
    computeCarouselStepLabel,
    computePositionLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PageCarouselBar,
    PageCarouselPick,
    PageCarouselRotation,
    PageCarouselStep,
} from "../../StyledComponents/CarouselContent/CarouselContent";

type Props = {
    controls: CarouselControls;
    isDisabled?: boolean;
    hasPicks?: boolean;
    hasRotation?: boolean;
};

export const PageCarouselsBar = (props: Props) => {
    const { controls } = props;

    const index = useSyncExternalStore(controls.subscribe, controls.getIndex);
    const count = useSyncExternalStore(controls.subscribe, controls.getCount);
    const isPlaying = useSyncExternalStore(controls.subscribe, controls.getIsPlaying);
    const canStepPrevious = useSyncExternalStore(controls.subscribe, () => controls.getCanStep("previous"));
    const canStepNext = useSyncExternalStore(controls.subscribe, () => controls.getCanStep("next"));

    const barRef = useRef<HTMLDivElement>(null);

    const isHeld = InteractionTrackerReactUtils.useHold(barRef);

    useEffect(() => {
        controls.setIsHeldByPage(isHeld);
    }, [controls, isHeld]);

    const renderStep = (step: CarouselStep, canStep: boolean) => (
        <Button
            ariaLabel={computeCarouselStepLabel(step)}
            isDisabled={!canStep}
            renderContent={(flags) => <PageCarouselStep flags={flags} step={step} />}
            onClick={() => {
                controls.step(step);
            }}
        />
    );

    const renderPick = (pickIndex: number) => {
        const isCurrent = pickIndex === index;

        return (
            <InteractionWrapper
                key={pickIndex}
                isDisabled={props.isDisabled ?? false}
                renderControl={(setElementRef, flags) => (
                    <button
                        ref={setElementRef}
                        type="button"
                        className={ButtonStyles.buttonElement}
                        aria-label={computePositionLabel(pickIndex, count)}
                        aria-current={isCurrent || undefined}
                        aria-disabled={flags.isDisabled || undefined}
                        onClick={() => {
                            if (flags.isDisabled) return;

                            controls.pick(pickIndex);
                        }}
                    >
                        <PageCarouselPick flags={flags} isCurrent={isCurrent} />
                    </button>
                )}
            />
        );
    };

    return (
        <PageCarouselBar ref={barRef}>
            {props.hasRotation && (
                <Button
                    ariaLabel={computeCarouselRotationLabel(isPlaying)}
                    isDisabled={props.isDisabled ?? false}
                    renderContent={(flags) => <PageCarouselRotation flags={flags} isPlaying={isPlaying} />}
                    onClick={() => {
                        controls.setIsPlaying(!controls.getIsPlaying());
                    }}
                />
            )}

            {renderStep("previous", canStepPrevious)}

            {props.hasPicks && Array.from({ length: count }, (_, pickIndex) => renderPick(pickIndex))}

            {renderStep("next", canStepNext)}
        </PageCarouselBar>
    );
};
