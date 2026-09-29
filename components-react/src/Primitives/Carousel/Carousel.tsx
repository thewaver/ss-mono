import { type ReactNode, useEffect, useRef, useState } from "react";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPickRenderProps,
    type CarouselRotationFlags,
    type CarouselSlideState,
    type CarouselStep,
    type CarouselStepRenderProps,
    CarouselStyles,
    CarouselUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";

import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import { Barrel } from "../Barrel/Barrel";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { CarouselControlProps, CarouselControls, CarouselProps } from "./Carousel.types";

const CarouselControl = (props: CarouselControlProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    return (
        <button
            ref={props.ref}
            type="button"
            className={CarouselStyles.carouselControl}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled || undefined}
            aria-current={props.isCurrent || undefined}
            onClick={() => {
                if (isDisabled) return;

                props.onActivate();
            }}
        >
            {props.renderContent(props.flags)}
        </button>
    );
};

export const Carousel = <T,>(props: CarouselProps<T>) => {
    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [swipeRatio, setSwipeRatio] = useState(0);

    const [index, setIndex] = SignalMirrorReactUtils.useOptionalState(props.index, 0);
    const [isPlaying, setIsPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);

    const count = props.slides.length;
    const currentIndex = CarouselUtils.wrapIndex(index, count);
    const isDisabled = props.isDisabled ?? false;
    const isLooping = props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
    const isDrum = props.variant === "drum";
    const orientation = props.orientation ?? CAROUSEL_DEFAULTS.orientation;
    const axis = props.axis ?? CAROUSEL_DEFAULTS.axis;
    const slideSize = props.slideSize ?? CAROUSEL_DEFAULTS.slideSize;
    const travelsAcross = CarouselUtils.getTravelsAcross(isDrum, axis, orientation);
    const transitionDurationMs = props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;
    const autoplayDelayMs = props.autoplayDelayMs;
    const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const isHeld = InteractionTrackerReactUtils.useHold(rootRef);

    const goTo = (target: number) => {
        const next = CarouselUtils.resolveIndex(target, count, isLooping);

        if (next === undefined || next === currentIndex) return;

        setIndex(next);

        void props.onIndexChange?.(next);
    };

    const goToRef = useLatest(goTo);

    const { isSwiping } = InteractionTrackerReactUtils.useAxialSwipe(
        viewportRef,
        CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, isDisabled, count),
        {
            axis: travelsAcross ? "horizontal" : "vertical",
            commitRatio: CarouselUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                setSwipeRatio(CarouselUtils.clampSwipeRatio(progressRatio));
            },
            onSwipeEnd: (direction) => {
                setSwipeRatio(0);

                if (direction === undefined) return;

                goTo(currentIndex + CarouselUtils.getSwipeStep(direction));
            },
        },
    );

    const isRotating = CarouselUtils.getIsRotating({
        autoplayDelayMs,
        isPlaying,
        isHeld,
        isSwiping,
        isDisabled,
        count,
    });

    const [turn, setTurn] = useState(() => ({
        angle: CarouselUtils.computeTurnAngle(0, undefined, currentIndex, count),
        index: currentIndex,
        count,
    }));

    if (turn.index !== currentIndex || turn.count !== count) {
        setTurn({
            angle: CarouselUtils.computeTurnAngle(turn.angle, turn, currentIndex, count),
            index: currentIndex,
            count,
        });
    }

    const angle = CarouselUtils.getDrumAngle(turn.angle, swipeRatio, count);

    const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count);

    const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
        index: slideIndex,
        count,
        face,
        isCurrent: slideIndex === currentIndex,
    });

    useEffect(() => {
        if (!isRotating || autoplayDelayMs === undefined) return;

        const advance = setTimeout(() => goToRef.current(currentIndex + 1), autoplayDelayMs);

        return () => {
            clearTimeout(advance);
        };
    }, [isRotating, autoplayDelayMs, currentIndex, goToRef]);

    const announcedIndexRef = useRef<number | undefined>(undefined);
    const isRotatingRef = useLatest(isRotating);

    useEffect(() => {
        if (CarouselUtils.getIsAnnounced(announcedIndexRef.current, currentIndex, isRotatingRef.current)) {
            LiveAnnouncerUtils.announce(props.computeSlideLabel(currentIndex, count));
        }

        announcedIndexRef.current = currentIndex;
    }, [currentIndex]);

    const isPlaybackAtEnd = CarouselUtils.getIsPlaybackAtEnd({
        isLooping,
        autoplayDelayMs,
        isPlaying,
        isDisabled,
        count,
        index: currentIndex,
    });

    useEffect(() => {
        if (isPlaybackAtEnd) setIsPlaying(false);
    }, [isPlaybackAtEnd]);

    const renderStepControl = (step: CarouselStep): ReactNode => {
        const targetIndex = CarouselUtils.getStepTarget(step, currentIndex, count, isLooping);

        return (
            <InteractionWrapper<CarouselStepRenderProps>
                key={step}
                isDisabled={CarouselUtils.getIsStepDisabled(step, currentIndex, count, isLooping, isDisabled)}
                extraFlags={{ step, targetIndex }}
                renderControl={(setElementRef, renderProps) => (
                    <CarouselControl
                        ref={setElementRef}
                        isCurrent={false}
                        ariaLabel={props.computeStepLabel(step)}
                        flags={renderProps}
                        renderContent={() => props.renderStep?.(step, renderProps)}
                        onActivate={() => goTo(targetIndex)}
                    />
                )}
            />
        );
    };

    const renderPickControl = (pickIndex: number): ReactNode => (
        <InteractionWrapper<CarouselPickRenderProps>
            key={pickIndex}
            isDisabled={isDisabled}
            extraFlags={{ index: pickIndex, isCurrent: pickIndex === currentIndex }}
            renderControl={(setElementRef, renderProps) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={renderProps.isCurrent}
                    ariaLabel={getSlideLabel(pickIndex)}
                    flags={renderProps}
                    renderContent={() => props.renderPick?.(pickIndex, renderProps)}
                    onActivate={() => goTo(pickIndex)}
                />
            )}
        />
    );

    const renderRotationControl = (): ReactNode => (
        <InteractionWrapper<CarouselRotationFlags>
            key="rotation"
            isDisabled={isDisabled}
            extraFlags={{ isPlaying, isHeld }}
            renderControl={(setElementRef, flags) => (
                <CarouselControl
                    ref={setElementRef}
                    isCurrent={false}
                    ariaLabel={props.computeRotationLabel(isPlaying)}
                    flags={flags}
                    renderContent={() => props.renderRotationControl?.(flags)}
                    onActivate={() => setIsPlaying(!isPlaying)}
                />
            )}
        />
    );

    const controls: CarouselControls = {
        index: currentIndex,
        count,
        isPlaying,
        isHeld,
        renderStep: renderStepControl,
        renderPick: renderPickControl,
        renderRotationControl,
    };

    const renderSlide = (slide: T, slideIndex: number, face: CarouselFace) =>
        face === "back"
            ? props.renderSlideBack?.(slide, getSlideState(slideIndex, face))
            : props.renderSlide(slide, getSlideState(slideIndex, face));

    return (
        <div
            ref={rootRef}
            className={CarouselStyles.carouselRoot}
            style={{
                height: !isDrum && orientation === "vertical" ? "100%" : undefined,
                gap: `${props.gap ?? CAROUSEL_DEFAULTS.gap}px`,
            }}
            role="region"
            aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
        >
            {isDrum ? (
                <div ref={viewportRef} className={CarouselStyles.carouselStage}>
                    <Barrel<T>
                        faces={props.slides}
                        axis={axis}
                        faceSize={slideSize}
                        angle={angle}
                        transitionDurationMs={isSwiping ? 0 : transitionDurationMs}
                        faceRoleDescription={slideRoleDescription}
                        computeFaceDefs={(faceIndex, face) => ({
                            ariaLabel: getSlideLabel(faceIndex),
                            isHidden: face === "back" || faceIndex !== currentIndex,
                        })}
                        renderFace={renderSlide}
                    />
                </div>
            ) : (
                <div ref={viewportRef} className={CarouselStyles.carouselViewport}>
                    <div
                        className={CarouselStyles.carouselTrack}
                        style={{
                            flexDirection: orientation === "horizontal" ? "row" : "column",
                            height: orientation === "vertical" ? "100%" : undefined,
                            transform: CarouselUtils.getTrackTransform(travelsAcross, swipeRatio, currentIndex),
                            transitionDuration: `${isSwiping ? 0 : transitionDurationMs}ms`,
                        }}
                    >
                        {props.slides.map((slide, slideIndex) => (
                            <div
                                key={slideIndex}
                                className={CarouselStyles.carouselSlide}
                                role="group"
                                aria-roledescription={slideRoleDescription}
                                aria-label={getSlideLabel(slideIndex)}
                                aria-hidden={slideIndex !== currentIndex ? "true" : undefined}
                                inert={slideIndex !== currentIndex}
                            >
                                {renderSlide(slide, slideIndex, "front")}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {props.renderControls?.(controls)}
        </div>
    );
};
