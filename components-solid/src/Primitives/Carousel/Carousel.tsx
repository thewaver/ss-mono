import type { Accessor, JSX } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPickRenderProps,
    type CarouselRotationFlags,
    type CarouselSlideState,
    type CarouselStep,
    type CarouselStepRenderProps,
    CarouselUtils,
    LiveAnnouncerUtils,
    CarouselStyles as styles,
} from "@thewaver/ss-components";

import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import { Barrel } from "../Barrel/Barrel";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { CarouselControlProps, CarouselControls, CarouselProps } from "./CarouselSolid.types";

const CarouselControl = (props: CarouselControlProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <button
            ref={(element) => props.ref?.(element)}
            type="button"
            class={styles.carouselControl}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            aria-current={access(props.isCurrent) || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onActivate();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </button>
    );
};

export const Carousel = <T,>(props: CarouselProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getViewportRef, setViewportRef] = createSignal<HTMLElement>();
    const [getSwipeRatio, setSwipeRatio] = createSignal(0);
    const [getTurnAngle, setTurnAngle] = createSignal(0);

    const [getIndex, setIndex] = SignalMirrorSolidUtils.createOptional(() => props.indexSignal, 0);
    const [getIsPlaying, setIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playbackSignal, true);

    const getCount = createMemo(() => access(props.slides).length);

    const getCurrentIndex = createMemo(() => CarouselUtils.wrapIndex(getIndex(), getCount()));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLooping = createMemo(() => access(props.isLooping) ?? CAROUSEL_DEFAULTS.isLooping);

    const getIsDrum = createMemo(() => access(props.variant) === "drum");

    const getOrientation = createMemo(() => access(props.orientation) ?? CAROUSEL_DEFAULTS.orientation);

    const getAxis = createMemo(() => access(props.axis) ?? CAROUSEL_DEFAULTS.axis);

    const getSlideSize = createMemo(() => access(props.slideSize) ?? CAROUSEL_DEFAULTS.slideSize);

    const getTravelsAcross = createMemo(() => CarouselUtils.getTravelsAcross(getIsDrum(), getAxis(), getOrientation()));

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CAROUSEL_DEFAULTS.transitionDurationMs,
    );

    const getAutoplayDelayMs = createMemo(() => access(props.autoplayDelayMs));

    const getIsHeld = InteractionTrackerSolidUtils.trackHold(getRootRef);

    const goTo = (index: number) => {
        const next = CarouselUtils.resolveIndex(index, getCount(), getIsLooping());

        if (next === undefined || next === getCurrentIndex()) return;

        setIndex(next);

        void props.onIndexChange?.(next);
    };

    const { getIsSwiping } = InteractionTrackerSolidUtils.trackAxialSwipe(
        getViewportRef,
        () => CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, getIsDisabled(), getCount()),
        {
            getAxis: () => (getTravelsAcross() ? "horizontal" : "vertical"),
            getCommitRatio: () => CarouselUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                setSwipeRatio(CarouselUtils.clampSwipeRatio(progressRatio));
            },
            onSwipeEnd: (direction) => {
                setSwipeRatio(0);

                if (direction === undefined) return;

                goTo(getCurrentIndex() + CarouselUtils.getSwipeStep(direction));
            },
        },
    );

    const getIsRotating = createMemo(() =>
        CarouselUtils.getIsRotating({
            autoplayDelayMs: getAutoplayDelayMs(),
            isPlaying: getIsPlaying(),
            isHeld: getIsHeld(),
            isSwiping: getIsSwiping(),
            isDisabled: getIsDisabled(),
            count: getCount(),
        }),
    );

    const getAngle = createMemo(() => CarouselUtils.getDrumAngle(getTurnAngle(), getSwipeRatio(), getCount()));

    const getSlideLabel = (index: number) => props.computeSlideLabel(index, getCount());

    const getSlideRoleDescription = () => access(props.slideRoleDescription) ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const getSlideState = (index: number, face: CarouselFace): CarouselSlideState => ({
        index,
        count: getCount(),
        face,
        isCurrent: index === getCurrentIndex(),
    });

    createEffect<{ index: number; count: number } | undefined>((previous) => {
        const index = getCurrentIndex();
        const count = getCount();

        setTurnAngle((angle) => CarouselUtils.computeTurnAngle(angle, previous, index, count));

        return { index, count };
    });

    createEffect(() => {
        const delayMs = getAutoplayDelayMs();

        if (!getIsRotating() || delayMs === undefined) return;

        const from = getCurrentIndex();
        const advance = setTimeout(() => goTo(from + 1), delayMs);

        onCleanup(() => {
            clearTimeout(advance);
        });
    });

    createEffect<number | undefined>((previous) => {
        const index = getCurrentIndex();

        if (CarouselUtils.getIsAnnounced(previous, index, getIsRotating())) {
            LiveAnnouncerUtils.announce(getSlideLabel(index));
        }

        return index;
    });

    createEffect(() => {
        const isAtEnd = CarouselUtils.getIsPlaybackAtEnd({
            isLooping: getIsLooping(),
            autoplayDelayMs: getAutoplayDelayMs(),
            isPlaying: getIsPlaying(),
            isDisabled: getIsDisabled(),
            count: getCount(),
            index: getCurrentIndex(),
        });

        if (isAtEnd) setIsPlaying(false);
    });

    const renderStepControl = (step: CarouselStep): JSX.Element => {
        const getTargetIndex = () => CarouselUtils.getStepTarget(step, getCurrentIndex(), getCount(), getIsLooping());

        return (
            <InteractionWrapper<CarouselStepRenderProps>
                isDisabled={() =>
                    CarouselUtils.getIsStepDisabled(
                        step,
                        getCurrentIndex(),
                        getCount(),
                        getIsLooping(),
                        getIsDisabled(),
                    )
                }
                extraFlags={() => ({ step, targetIndex: getTargetIndex() })}
                renderControl={(setElementRef, getRenderProps) => (
                    <CarouselControl
                        ref={setElementRef}
                        isCurrent={false}
                        ariaLabel={() => props.computeStepLabel(step)}
                        flags={getRenderProps}
                        renderContent={() => props.renderStep?.(() => step, getRenderProps)}
                        onActivate={() => goTo(getTargetIndex())}
                    />
                )}
            />
        );
    };

    const renderPickControl = (index: number): JSX.Element => (
        <InteractionWrapper<CarouselPickRenderProps>
            isDisabled={getIsDisabled}
            extraFlags={() => ({ index, isCurrent: index === getCurrentIndex() })}
            renderControl={(setElementRef, getRenderProps) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={() => getRenderProps().isCurrent}
                    ariaLabel={() => getSlideLabel(index)}
                    flags={getRenderProps}
                    renderContent={() => props.renderPick?.(() => index, getRenderProps)}
                    onActivate={() => goTo(index)}
                />
            )}
        />
    );

    const renderRotationControl = (): JSX.Element => (
        <InteractionWrapper<CarouselRotationFlags>
            isDisabled={getIsDisabled}
            extraFlags={() => ({ isPlaying: getIsPlaying(), isHeld: getIsHeld() })}
            renderControl={(setElementRef, getFlags) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={false}
                    ariaLabel={() => props.computeRotationLabel(getIsPlaying())}
                    flags={getFlags}
                    renderContent={() => props.renderRotationControl?.(getFlags)}
                    onActivate={() => setIsPlaying((prev) => !prev)}
                />
            )}
        />
    );

    const controls: CarouselControls = {
        getIndex: getCurrentIndex,
        getCount,
        getIsPlaying,
        getIsHeld,
        renderStep: renderStepControl,
        renderPick: renderPickControl,
        renderRotationControl,
    };

    const renderSlide = (getSlide: Accessor<T>, index: number, face: CarouselFace) =>
        face === "back"
            ? props.renderSlideBack?.(getSlide, () => getSlideState(index, face))
            : props.renderSlide(getSlide, () => getSlideState(index, face));

    return (
        <div
            ref={setRootRef}
            class={styles.carouselRoot}
            style={{
                height: !getIsDrum() && getOrientation() === "vertical" ? "100%" : undefined,
                gap: `${access(props.gap) ?? CAROUSEL_DEFAULTS.gap}px`,
            }}
            role="region"
            aria-roledescription={access(props.roleDescription) ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <Show
                when={getIsDrum()}
                fallback={
                    <div ref={setViewportRef} class={styles.carouselViewport}>
                        <div
                            class={styles.carouselTrack}
                            style={{
                                "flex-direction": getOrientation() === "horizontal" ? "row" : "column",
                                "height": getOrientation() === "vertical" ? "100%" : undefined,
                                "transform": CarouselUtils.getTrackTransform(
                                    getTravelsAcross(),
                                    getSwipeRatio(),
                                    getCurrentIndex(),
                                ),
                                "transition-duration": `${getIsSwiping() ? 0 : getTransitionDurationMs()}ms`,
                            }}
                        >
                            <Index each={access(props.slides)}>
                                {(getSlide, index) => (
                                    <div
                                        class={styles.carouselSlide}
                                        role="group"
                                        aria-roledescription={getSlideRoleDescription()}
                                        aria-label={getSlideLabel(index)}
                                        aria-hidden={index !== getCurrentIndex() || undefined}
                                        inert={index !== getCurrentIndex()}
                                    >
                                        {renderSlide(getSlide, index, "front")}
                                    </div>
                                )}
                            </Index>
                        </div>
                    </div>
                }
            >
                <div ref={setViewportRef} class={styles.carouselStage}>
                    <Barrel<T>
                        faces={props.slides}
                        axis={getAxis}
                        faceSize={getSlideSize}
                        angle={getAngle}
                        transitionDurationMs={() => (getIsSwiping() ? 0 : getTransitionDurationMs())}
                        faceRoleDescription={getSlideRoleDescription}
                        computeFaceDefs={(index, face) => ({
                            ariaLabel: getSlideLabel(index),
                            isHidden: face === "back" || index !== getCurrentIndex(),
                        })}
                        renderFace={renderSlide}
                    />
                </div>
            </Show>

            {props.renderControls?.(controls)}
        </div>
    );
};
