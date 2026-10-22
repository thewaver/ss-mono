import { For, Show, createEffect, createSignal } from "solid-js";

import {
    Button,
    ButtonStyles,
    InteractionTrackerSolidUtils,
    InteractionWrapper,
    access,
} from "@thewaver/ss-components-solid";
import type { CarouselControls, CarouselStep, MaybeAccessor } from "@thewaver/ss-components-solid";
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
    isDisabled: MaybeAccessor<boolean>;
    hasPicks?: boolean;
    hasRotation?: boolean;
};

export const PageCarouselsBar = (props: Props) => {
    const [getBarRef, setBarRef] = createSignal<HTMLElement>();

    const getIsHeld = InteractionTrackerSolidUtils.trackHold(getBarRef);

    createEffect(() => {
        props.controls.setIsHeldByPage(getIsHeld());
    });

    const renderStep = (step: CarouselStep) => (
        <Button
            ariaLabel={computeCarouselStepLabel(step)}
            isDisabled={() => !props.controls.getCanStep(step)}
            renderContent={(getFlags) => <PageCarouselStep flags={getFlags} step={step} />}
            onClick={() => {
                props.controls.step(step);
            }}
        />
    );

    const renderPick = (index: number) => {
        const getIsCurrent = () => index === props.controls.getIndex();

        return (
            <InteractionWrapper
                isDisabled={() => access(props.isDisabled)}
                renderControl={(setElementRef, getFlags) => (
                    <button
                        ref={setElementRef}
                        type="button"
                        class={ButtonStyles.buttonElement}
                        aria-label={computePositionLabel(index, props.controls.getCount())}
                        aria-current={getIsCurrent() || undefined}
                        aria-disabled={getFlags().isDisabled || undefined}
                        onClick={() => {
                            if (getFlags().isDisabled) return;

                            props.controls.pick(index);
                        }}
                    >
                        <PageCarouselPick flags={getFlags} isCurrent={getIsCurrent} />
                    </button>
                )}
            />
        );
    };

    return (
        <PageCarouselBar ref={setBarRef}>
            <Show when={props.hasRotation}>
                <Button
                    ariaLabel={() => computeCarouselRotationLabel(props.controls.getIsPlaying())}
                    isDisabled={() => access(props.isDisabled)}
                    renderContent={(getFlags) => (
                        <PageCarouselRotation flags={getFlags} isPlaying={props.controls.getIsPlaying} />
                    )}
                    onClick={() => {
                        props.controls.setIsPlaying(!props.controls.getIsPlaying());
                    }}
                />
            </Show>

            {renderStep("previous")}

            <Show when={props.hasPicks}>
                <For each={Array.from({ length: props.controls.getCount() }, (_, index) => index)}>{renderPick}</For>
            </Show>

            {renderStep("next")}
        </PageCarouselBar>
    );
};
