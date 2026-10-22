import { type CSSProperties, type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPlacement,
    type CarouselSlideState,
    type CarouselStep,
    CarouselStyles,
    CarouselUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";
import { CarouselConst } from "@thewaver/ss-components/internal";
import { StoreUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import type { CarouselControls, CarouselProps } from "./Carousel.types";

type ControlsSnapshot = {
    index: number;
    count: number;
    isPlaying: boolean;
    isHeld: boolean;
    isLooping: boolean;
    isDisabled: boolean;
};

const getIsSameSnapshot = (first: ControlsSnapshot, second: ControlsSnapshot) =>
    first.index === second.index &&
    first.count === second.count &&
    first.isPlaying === second.isPlaying &&
    first.isHeld === second.isHeld &&
    first.isLooping === second.isLooping &&
    first.isDisabled === second.isDisabled;

const getIsStepRefused = (step: CarouselStep, current: ControlsSnapshot) =>
    CarouselUtils.getIsStepDisabled(step, current.index, current.count, current.isLooping, current.isDisabled);

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const Carousel = <T,>(props: CarouselProps<T>) => {
    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [swipeRatio, setSwipeRatioState] = useState(0);

    const [index, setIndex] = SignalMirrorReactUtils.useOptionalState(props.index, 0);
    const [isPlaying, setIsPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        CarouselConst.NO_PROGRESS,
    );

    const count = props.slides.length;
    const currentIndex = CarouselUtils.wrapIndex(index, count);
    const isDisabled = props.isDisabled ?? false;
    const isLooping = props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
    const isWindowed = props.isWindowed ?? CAROUSEL_DEFAULTS.isWindowed;
    const orientation = props.orientation ?? CAROUSEL_DEFAULTS.orientation;
    const transitionDurationMs = props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;
    const autoplayDelayMs = props.autoplayDelayMs;
    const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;

    const [isHeldByPage, setIsHeldByPage] = useState(false);

    const isHeldWithin = InteractionTrackerReactUtils.useHold(rootRef);

    const isHeld = isHeldWithin || isHeldByPage;

    const size = ElementObserverReactUtils.useBorderBoxSize(viewportRef);

    const progressRef = useLatest(progress);
    const swipeRatioRef = useLatest(swipeRatio);
    const stopGlideRef = useRef<(() => void) | undefined>(undefined);
    const isGlidingRef = useRef(false);
    const writtenProgressRef = useRef<number | undefined>(undefined);

    const position = CarouselUtils.toPosition(progress, count, isLooping);
    const drawnPosition = position - swipeRatio;

    const copies = CarouselUtils.getCopyCount(count, props.placement.reach, isLooping);
    const ringCount = count * copies;
    const [followedRing, setFollowedRing] = useState<number | undefined>(undefined);
    const ringPosition = CarouselUtils.followCopies(followedRing, drawnPosition, count, copies);

    if (ringPosition !== followedRing) setFollowedRing(ringPosition);

    const currentPlace = CarouselUtils.getNearestCopy(currentIndex, ringPosition, count, copies);
    const ringPlaces = Array.from({ length: ringCount }, (_, place) => place);
    const toIndex = (place: number) => place % Math.max(count, 1);

    const isPressDisabled = CarouselUtils.getIsSwipeDisabled(props.progress !== undefined, isDisabled, count);

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

    const getDistance = (place: number) => CarouselUtils.getDistance(place, ringPosition, ringCount, isLooping);

    const getSlideState = (place: number, face: CarouselFace): CarouselSlideState => ({
        index: toIndex(place),
        count,
        distance: getDistance(place),
        face,
        isCurrent: place === currentPlace,
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

    const placements: (CarouselPlacement | undefined)[] = ringPlaces.map((place) =>
        CarouselUtils.getIsBuilt(getDistance(place), props.placement.reach, isWindowed)
            ? props.placement.place({
                  distance: getDistance(place),
                  index: place,
                  count: ringCount,
                  size,
                  orientation,
                  isLooping,
              })
            : undefined,
    );

    const handleViewportClick = (e: MouseEvent<HTMLDivElement>) => {
        if (isPressDisabled) return;

        const getDrawn = (place: number) => {
            const face = faceRefs.current[place];

            return face?.firstElementChild ?? face;
        };

        if (getDrawn(currentPlace)?.contains(e.target as Node)) return;

        const rects = ringPlaces.map((place) =>
            place !== currentPlace &&
            placements[place] !== undefined &&
            placements[place].effect.opacity !== CarouselConst.HIDDEN_OPACITY
                ? getDrawn(place)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit !== undefined) goTo(toIndex(hit));
    };

    const snapshot: ControlsSnapshot = { index: currentIndex, count, isPlaying, isHeld, isLooping, isDisabled };

    const [controlsStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controlsStore.set(snapshot);
    });

    const commandsRef = useLatest({ snapshot, goTo, setIsPlaying, isHeldByPage });

    const [controls] = useState<CarouselControls>(() => ({
        getIndex: () => controlsStore.get().index,
        getCount: () => controlsStore.get().count,
        getIsPlaying: () => controlsStore.get().isPlaying,
        getIsHeld: () => controlsStore.get().isHeld,
        getCanStep: (step) => !getIsStepRefused(step, controlsStore.get()),
        step: (step) => {
            const { snapshot: current, goTo: goToNow } = commandsRef.current;

            if (getIsStepRefused(step, current)) return false;

            goToNow(CarouselUtils.getStepTarget(step, current.index, current.count, current.isLooping));

            return true;
        },
        pick: (index) => {
            const { snapshot: current, goTo: goToNow } = commandsRef.current;

            if (current.isDisabled || index < 0 || index >= current.count || index === current.index) return false;

            goToNow(index);

            return true;
        },
        setIsPlaying: (isPlayingNext) => {
            const { snapshot: current, setIsPlaying: setIsPlayingNow } = commandsRef.current;

            if (current.isDisabled || isPlayingNext === current.isPlaying) return false;

            setIsPlayingNow(isPlayingNext);

            return true;
        },
        setIsHeldByPage: (isHeldNext) => {
            if (isHeldNext === commandsRef.current.isHeldByPage) return false;

            setIsHeldByPage(isHeldNext);

            return true;
        },
        subscribe: controlsStore.subscribe,
    }));

    useEffect(() => {
        props.onMount?.(controls);
    }, [controls]);

    return (
        <div
            ref={rootRef}
            className={CarouselStyles.carouselRoot}
            role="region"
            aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
        >
            <div ref={viewportRef} className={CarouselStyles.carouselViewport} onClick={handleViewportClick}>
                {ringPlaces.map((place) => {
                    const slide = props.slides[toIndex(place)];
                    const placement = placements[place];
                    const isCurrent = place === currentPlace;

                    if (placement === undefined) return null;

                    return (
                        <div
                            key={place}
                            className={CarouselStyles.carouselSlide}
                            style={toReactStyle(CarouselUtils.toSlideStyle(placement, getDistance(place)))}
                            role="group"
                            aria-roledescription={slideRoleDescription}
                            aria-label={getSlideLabel(toIndex(place))}
                            aria-hidden={isCurrent ? undefined : "true"}
                            inert={!isCurrent}
                        >
                            <div
                                ref={(element) => {
                                    faceRefs.current[place] = element;
                                }}
                                className={[
                                    CarouselStyles.carouselFace,
                                    props.renderSlideBack && CarouselStyles.carouselFaceTurnable,
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {props.renderSlide(slide, getSlideState(place, "front"))}
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
                                    {props.renderSlideBack(slide, getSlideState(place, "back"))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
