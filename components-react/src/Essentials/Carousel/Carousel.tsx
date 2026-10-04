import { type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPickRenderProps,
    type CarouselPlacement,
    type CarouselRotationFlags,
    type CarouselSlideState,
    type CarouselStep,
    type CarouselStepRenderProps,
    CarouselStyles,
    CarouselUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { useLatest } from "../../Utils/refUtils";
import type { CarouselControlProps, CarouselControls, CarouselProps } from "./Carousel.types";

const NO_PROGRESS = 0;
const HIDDEN_OPACITY = 0;

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

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
    const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [swipeRatio, setSwipeRatioState] = useState(0);

    const [index, setIndex] = SignalMirrorReactUtils.useOptionalState(props.index, 0);
    const [isPlaying, setIsPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progress, NO_PROGRESS);

    const count = props.slides.length;
    const currentIndex = CarouselUtils.wrapIndex(index, count);
    const isDisabled = props.isDisabled ?? false;
    const isLooping = props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
    const orientation = props.orientation ?? CAROUSEL_DEFAULTS.orientation;
    const transitionDurationMs = props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;
    const autoplayDelayMs = props.autoplayDelayMs;
    const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const isHeld = InteractionTrackerReactUtils.useHold(rootRef);

    const size = ElementObserverReactUtils.useBorderBoxSize(viewportRef);

    const progressRef = useLatest(progress);
    const swipeRatioRef = useLatest(swipeRatio);
    const stopGlideRef = useRef<(() => void) | undefined>(undefined);
    const isGlidingRef = useRef(false);
    const writtenProgressRef = useRef<number | undefined>(undefined);

    const position = CarouselUtils.toPosition(progress, count, isLooping);
    const drawnPosition = position - swipeRatio;

    const isPressDisabled = CarouselUtils.getIsSwipeDisabled(props.renderControls !== undefined, isDisabled, count);

    const setSwipeRatio = (value: number) => {
        swipeRatioRef.current = value;
        setSwipeRatioState(value);
    };

    const writeProgress = (value: number) => {
        writtenProgressRef.current = value;
        progressRef.current = value;
        setProgressState(value);
    };

    const latest = useLatest({ count, isLooping, transitionDurationMs, writeProgress, setSwipeRatio });

    const glideTo = (target: number) => {
        const { count: slideCount, isLooping: isLoopingNow, transitionDurationMs: durationMs } = latest.current;
        const from = CarouselUtils.toPosition(progressRef.current, slideCount, isLoopingNow) - swipeRatioRef.current;

        stopGlideRef.current?.();
        latest.current.writeProgress(CarouselUtils.toProgress(from, slideCount, isLoopingNow));
        latest.current.setSwipeRatio(0);
        isGlidingRef.current = true;

        stopGlideRef.current = CarouselUtils.glide({
            from,
            to: CarouselUtils.getGlideTarget(from, target, slideCount, isLoopingNow),
            durationMs,
            onFrame: (next) => latest.current.writeProgress(CarouselUtils.toProgress(next, slideCount, isLoopingNow)),
            onEnd: () => {
                isGlidingRef.current = false;
            },
        });
    };

    useEffect(() => () => stopGlideRef.current?.(), []);

    const goTo = (target: number) => {
        const next = CarouselUtils.resolveIndex(target, count, isLooping);

        if (next === undefined || next === currentIndex) return;

        setIndex(next);

        void props.onIndexChange?.(next);
    };

    const goToRef = useLatest(goTo);

    const { isSwiping } = InteractionTrackerReactUtils.useAxialSwipe(viewportRef, isPressDisabled, {
        axis: CarouselUtils.getTravelsAcross(orientation) ? "horizontal" : "vertical",
        commitRatio: CarouselUtils.SWIPE_COMMIT_RATIO,
        onSwipe: (progressRatio) => {
            setSwipeRatio(CarouselUtils.clampSwipeRatio(progressRatio));
        },
        onSwipeEnd: (direction) => {
            const target =
                direction === undefined
                    ? undefined
                    : CarouselUtils.resolveIndex(
                          currentIndex + CarouselUtils.getSwipeStep(direction),
                          count,
                          isLooping,
                      );

            if (target === undefined || target === currentIndex) {
                glideTo(currentIndex);

                return;
            }

            goTo(target);
        },
    });

    const isRotating = CarouselUtils.getIsRotating({
        autoplayDelayMs,
        isPlaying,
        isHeld,
        isSwiping,
        isDisabled,
        count,
    });

    const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count);

    const getDistance = (slideIndex: number) => CarouselUtils.getDistance(slideIndex, drawnPosition, count, isLooping);

    const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
        index: slideIndex,
        count,
        distance: getDistance(slideIndex),
        face,
        isCurrent: slideIndex === currentIndex,
    });

    const previousIndexRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const previous = previousIndexRef.current;
        const { count: slideCount, isLooping: isLoopingNow } = latest.current;
        const isThere =
            CarouselUtils.getNearestIndex(
                CarouselUtils.toPosition(progressRef.current, slideCount, isLoopingNow),
                slideCount,
                isLoopingNow,
            ) === currentIndex;

        previousIndexRef.current = currentIndex;

        if (previous === undefined) {
            if (!isThere) {
                latest.current.writeProgress(CarouselUtils.toProgress(currentIndex, slideCount, isLoopingNow));
            }

            return;
        }

        if (isThere && !isGlidingRef.current) return;

        glideTo(currentIndex);
    }, [currentIndex]);

    const hasProgressMountedRef = useRef(false);
    const onIndexChangeRef = useLatest(props.onIndexChange);
    const currentIndexRef = useLatest(currentIndex);

    useEffect(() => {
        if (!hasProgressMountedRef.current) {
            hasProgressMountedRef.current = true;

            return;
        }

        if (isGlidingRef.current) {
            if (progress === writtenProgressRef.current) return;

            stopGlideRef.current?.();
            isGlidingRef.current = false;
        }

        const { count: slideCount, isLooping: isLoopingNow } = latest.current;
        const nearest = CarouselUtils.getNearestIndex(
            CarouselUtils.toPosition(progress, slideCount, isLoopingNow),
            slideCount,
            isLoopingNow,
        );

        if (nearest === currentIndexRef.current) return;

        setIndex(nearest);

        void onIndexChangeRef.current?.(nearest);
    }, [progress]);

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

    const placements: CarouselPlacement[] = props.slides.map((_, slideIndex) =>
        props.computePlacement({
            distance: getDistance(slideIndex),
            index: slideIndex,
            count,
            size,
            orientation,
            isLooping,
        }),
    );

    const handleViewportClick = (e: MouseEvent<HTMLDivElement>) => {
        if (isPressDisabled) return;

        const getDrawn = (slideIndex: number) => {
            const face = faceRefs.current[slideIndex];

            return face?.firstElementChild ?? face;
        };

        if (getDrawn(currentIndex)?.contains(e.target as Node)) return;

        const rects = props.slides.map((_, slideIndex) =>
            slideIndex !== currentIndex && placements[slideIndex].effect.opacity !== HIDDEN_OPACITY
                ? getDrawn(slideIndex)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit !== undefined) goTo(hit);
    };

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

    return (
        <div
            ref={rootRef}
            className={CarouselStyles.carouselRoot}
            style={{ gap: `${props.gap ?? CAROUSEL_DEFAULTS.gap}px` }}
            role="region"
            aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
        >
            <div ref={viewportRef} className={CarouselStyles.carouselViewport} onClick={handleViewportClick}>
                {props.slides.map((slide, slideIndex) => {
                    const placement = placements[slideIndex];
                    const isCurrent = slideIndex === currentIndex;

                    return (
                        <div
                            key={slideIndex}
                            className={CarouselStyles.carouselSlide}
                            style={toReactStyle(CarouselUtils.toSlideStyle(placement, getDistance(slideIndex)))}
                            role="group"
                            aria-roledescription={slideRoleDescription}
                            aria-label={getSlideLabel(slideIndex)}
                            aria-hidden={isCurrent ? undefined : "true"}
                            inert={!isCurrent}
                        >
                            <div
                                ref={(element) => {
                                    faceRefs.current[slideIndex] = element;
                                }}
                                className={[
                                    CarouselStyles.carouselFace,
                                    props.renderSlideBack && CarouselStyles.carouselFaceTurnable,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {props.renderSlide(slide, getSlideState(slideIndex, "front"))}
                            </div>

                            {props.renderSlideBack && (
                                <div
                                    className={[CarouselStyles.carouselFace, CarouselStyles.carouselFaceTurnable].join(
                                        " ",
                                    )}
                                    style={{
                                        transform: CarouselUtils.getBackTransform(
                                            CarouselUtils.getTurnAxis(placement, orientation),
                                        ),
                                    }}
                                    aria-hidden="true"
                                >
                                    {props.renderSlideBack(slide, getSlideState(slideIndex, "back"))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {props.renderControls?.(controls)}
        </div>
    );
};
