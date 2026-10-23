import { type CSSProperties, type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CAROUSEL_DEFAULTS,
    type CarouselFace,
    type CarouselPlacement,
    type CarouselPlacementGroup,
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

    const computeGroups = props.computeGroups;
    const groups = useMemo(() => CarouselUtils.resolveGroups(computeGroups?.(count), count), [computeGroups, count]);
    const groupCount = groups.length;
    const rests = useMemo(() => groups.map(CarouselUtils.getGroupRest), [groups]);
    const memberships = useMemo(() => CarouselUtils.getGroupMemberships(groups, count), [groups, count]);

    const currentIndex = CarouselUtils.wrapIndex(index, groupCount);
    const currentGroup = groups[currentIndex];
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

    const position = CarouselUtils.toGroupPosition(progress, rests, count, isLooping);
    const drawnPosition = position - swipeRatio;

    const copies = CarouselUtils.getCopyCount(groupCount, props.placement.reach, isLooping);
    const ringCount = count * copies;
    const [followedRing, setFollowedRing] = useState<number | undefined>(undefined);
    const ringPosition = CarouselUtils.followCopies(followedRing, drawnPosition, count, copies);

    if (ringPosition !== followedRing) setFollowedRing(ringPosition);

    const ringRests = useMemo(
        () => Array.from({ length: copies }, (_, copy) => rests.map((rest) => rest + copy * count)).flat(),
        [copies, rests, count],
    );

    const groupPosition = CarouselUtils.toGroupCoordinate(ringPosition, ringRests, ringCount, isLooping);

    const currentPlace = currentGroup ? CarouselUtils.getGroupPlace(currentGroup, ringPosition, count, copies) : 0;

    const getIsCurrentPlace = (place: number) =>
        currentGroup !== undefined &&
        CarouselUtils.getIsInGroupPlace(place, currentPlace, currentGroup.end - currentGroup.start, ringCount);

    const ringPlaces = Array.from({ length: ringCount }, (_, place) => place);
    const toIndex = (place: number) => place % Math.max(count, 1);

    const isPressDisabled = CarouselUtils.getIsSwipeDisabled(props.progress !== undefined, isDisabled, groupCount);

    const setSwipeRatio = (value: number) => {
        swipeRatioRef.current = value;
        setSwipeRatioState(value);
    };

    const writeProgress = (value: number) => {
        writtenProgressRef.current = value;
        progressRef.current = value;
        setProgressState(value);
    };

    const latest = useLatest({ count, rests, isLooping, transitionDurationMs, writeProgress, setSwipeRatio });

    const glideTo = (target: number) => {
        const {
            count: slideCount,
            rests: groupRests,
            isLooping: isLoopingNow,
            transitionDurationMs: durationMs,
        } = latest.current;
        const from =
            CarouselUtils.toGroupPosition(progressRef.current, groupRests, slideCount, isLoopingNow) -
            swipeRatioRef.current;

        stopGlideRef.current?.();
        latest.current.writeProgress(CarouselUtils.toGroupProgress(from, groupRests, slideCount, isLoopingNow));
        latest.current.setSwipeRatio(0);
        isGlidingRef.current = true;

        stopGlideRef.current = CarouselUtils.glide({
            from,
            to: CarouselUtils.getGlideTarget(from, groupRests[target] ?? 0, slideCount, isLoopingNow),
            durationMs,
            onFrame: (next) =>
                latest.current.writeProgress(CarouselUtils.toGroupProgress(next, groupRests, slideCount, isLoopingNow)),
            onEnd: () => {
                isGlidingRef.current = false;
            },
        });
    };

    useEffect(() => () => stopGlideRef.current?.(), []);

    const goTo = (target: number) => {
        const next = CarouselUtils.resolveIndex(target, groupCount, isLooping);

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
                          groupCount,
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
        count: groupCount,
    });

    const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count);

    const getAnnouncement = (groupIndex: number) => {
        const group = groups[groupIndex];

        if (!group || !props.computeGroupLabel) return getSlideLabel(groupIndex);

        return props.computeGroupLabel(group.start, group.end, count);
    };

    const getDistance = (place: number) => CarouselUtils.getDistance(place, ringPosition, ringCount, isLooping);

    const getPlacementGroup = (place: number): CarouselPlacementGroup =>
        props.computeGroups === undefined
            ? CarouselUtils.toSlideGroup(getDistance(place), place, ringCount)
            : CarouselUtils.getPlacementGroup({
                  place,
                  groupPosition,
                  memberships,
                  rests: ringRests,
                  count,
                  groupCount,
                  copies,
                  isLooping,
              });

    const getSlideState = (place: number, face: CarouselFace): CarouselSlideState => ({
        index: toIndex(place),
        count,
        distance: getDistance(place),
        face,
        isCurrent: getIsCurrentPlace(place),
    });

    const previousIndexRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const previous = previousIndexRef.current;
        const { count: slideCount, rests: groupRests, isLooping: isLoopingNow } = latest.current;
        const isThere =
            CarouselUtils.getNearestGroup(
                CarouselUtils.toGroupPosition(progressRef.current, groupRests, slideCount, isLoopingNow),
                groupRests,
                slideCount,
                isLoopingNow,
            ) === currentIndex;

        previousIndexRef.current = currentIndex;

        if (previous === undefined) {
            if (!isThere) {
                latest.current.writeProgress(
                    CarouselUtils.toGroupProgress(groupRests[currentIndex] ?? 0, groupRests, slideCount, isLoopingNow),
                );
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

        const { count: slideCount, rests: groupRests, isLooping: isLoopingNow } = latest.current;
        const nearest = CarouselUtils.getNearestGroup(
            CarouselUtils.toGroupPosition(progress, groupRests, slideCount, isLoopingNow),
            groupRests,
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
    const getAnnouncementRef = useLatest(getAnnouncement);

    useEffect(() => {
        if (CarouselUtils.getIsAnnounced(announcedIndexRef.current, currentIndex, isRotatingRef.current)) {
            LiveAnnouncerUtils.announce(getAnnouncementRef.current(currentIndex));
        }

        announcedIndexRef.current = currentIndex;
    }, [currentIndex]);

    const isPlaybackAtEnd = CarouselUtils.getIsPlaybackAtEnd({
        isLooping,
        autoplayDelayMs,
        isPlaying,
        isDisabled,
        count: groupCount,
        index: currentIndex,
    });

    useEffect(() => {
        if (isPlaybackAtEnd) setIsPlaying(false);
    }, [isPlaybackAtEnd]);

    const placements: (CarouselPlacement | undefined)[] = ringPlaces.map((place) => {
        const group = getPlacementGroup(place);

        return CarouselUtils.getIsBuilt(group.distance, props.placement.reach, isWindowed)
            ? props.placement.place({
                  distance: getDistance(place),
                  group,
                  index: place,
                  count: ringCount,
                  size,
                  orientation,
                  isLooping,
              })
            : undefined;
    });

    const handleViewportClick = (e: MouseEvent<HTMLDivElement>) => {
        if (isPressDisabled) return;

        const getDrawn = (place: number) => {
            const face = faceRefs.current[place];

            return face?.firstElementChild ?? face;
        };

        if (ringPlaces.some((place) => getIsCurrentPlace(place) && getDrawn(place)?.contains(e.target as Node))) {
            return;
        }

        const rects = ringPlaces.map((place) =>
            !getIsCurrentPlace(place) &&
            placements[place] !== undefined &&
            placements[place].effect.opacity !== CarouselConst.HIDDEN_OPACITY
                ? getDrawn(place)?.getBoundingClientRect()
                : undefined,
        );
        const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

        if (hit === undefined) return;

        const group = CarouselUtils.getNearestGroupHolding(toIndex(hit), groups, position, count, isLooping);

        if (group !== undefined) goTo(group);
    };

    const snapshot: ControlsSnapshot = {
        index: currentIndex,
        count: groupCount,
        isPlaying,
        isHeld,
        isLooping,
        isDisabled,
    };

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
                    const isCurrent = getIsCurrentPlace(place);

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
