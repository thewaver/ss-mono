import { type SlotsType, computed, defineComponent, onScopeDispose, ref, shallowRef, watch } from "vue";

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

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CarouselControls, CarouselProps, CarouselSlots } from "./Carousel.types";

export const Carousel = defineComponent(
    <T,>(props: CarouselProps<T>, { slots }: SlotsContext<CarouselSlots<T>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const rootRef = shallowRef<HTMLDivElement>();
        const viewportRef = shallowRef<HTMLDivElement>();
        const swipeRatio = shallowRef(0);
        const isGliding = shallowRef(false);

        const index = useTwoWay(props, "index", 0);
        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", CarouselConst.NO_PROGRESS);

        const faceRefs: (HTMLElement | undefined)[] = [];
        const placements: (CarouselPlacement | undefined)[] = [];

        const count = computed(() => props.slides.length);
        const currentIndex = computed(() => CarouselUtils.wrapIndex(index.value, count.value));
        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsLooping = () => props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
        const getIsWindowed = () => props.isWindowed ?? CAROUSEL_DEFAULTS.isWindowed;
        const getOrientation = () => props.orientation ?? CAROUSEL_DEFAULTS.orientation;
        const getTransitionDurationMs = () => props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;

        const isHeldByPage = ref(false);

        const isHeldWithin = InteractionTrackerVueUtils.useHold(rootRef);

        const isHeld = computed(() => isHeldWithin.value || isHeldByPage.value);

        const size = ElementObserverVueUtils.useBorderBoxSize(viewportRef);

        const position = computed(() => CarouselUtils.toPosition(progress.value, count.value, getIsLooping()));

        const getDrawnPosition = () => position.value - swipeRatio.value;

        const copies = computed(() => CarouselUtils.getCopyCount(count.value, props.placement.reach, getIsLooping()));

        const ringCount = computed(() => count.value * copies.value);

        const ringPosition = computed<number>((previous) =>
            CarouselUtils.followCopies(previous, getDrawnPosition(), count.value, copies.value),
        );

        const currentPlace = computed(() =>
            CarouselUtils.getNearestCopy(currentIndex.value, ringPosition.value, count.value, copies.value),
        );

        const toIndex = (place: number) => place % Math.max(count.value, 1);

        const getIsPressDisabled = () =>
            CarouselUtils.getIsSwipeDisabled(props.progress !== undefined, getIsDisabled(), count.value);

        let stopGlide: (() => void) | undefined;
        let writtenProgress: number | undefined;

        const writeProgress = (next: number) => {
            writtenProgress = next;
            progress.value = next;
        };

        const glideTo = (target: number) => {
            const slideCount = count.value;
            const isLooping = getIsLooping();
            const from = getDrawnPosition();

            stopGlide?.();
            writeProgress(CarouselUtils.toProgress(from, slideCount, isLooping));
            swipeRatio.value = 0;
            isGliding.value = true;

            stopGlide = CarouselUtils.glide({
                from,
                to: CarouselUtils.getGlideTarget(from, target, slideCount, isLooping),
                durationMs: getTransitionDurationMs(),
                onFrame: (next) => writeProgress(CarouselUtils.toProgress(next, slideCount, isLooping)),
                onEnd: () => {
                    isGliding.value = false;
                },
            });
        };

        onScopeDispose(() => stopGlide?.());

        const goTo = (target: number) => {
            const next = CarouselUtils.resolveIndex(target, count.value, getIsLooping());

            if (next === undefined || next === currentIndex.value) return;

            index.value = next;

            void props.onIndexChange?.(next);
        };

        const { isSwiping } = InteractionTrackerVueUtils.useAxialSwipe(viewportRef, getIsPressDisabled, {
            axis: () => (CarouselUtils.getTravelsAcross(getOrientation()) ? "horizontal" : "vertical"),
            commitRatio: CarouselUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                swipeRatio.value = CarouselUtils.clampSwipeRatio(progressRatio);
            },
            onSwipeEnd: (direction) => {
                const current = currentIndex.value;
                const target =
                    direction === undefined
                        ? undefined
                        : CarouselUtils.resolveIndex(
                              current + CarouselUtils.getSwipeStep(direction),
                              count.value,
                              getIsLooping(),
                          );

                if (target === undefined || target === current) {
                    glideTo(current);

                    return;
                }

                goTo(target);
            },
        });

        if (CarouselUtils.getNearestIndex(position.value, count.value, getIsLooping()) !== currentIndex.value) {
            writeProgress(CarouselUtils.toProgress(currentIndex.value, count.value, getIsLooping()));
        }

        watch(currentIndex, (current) => {
            const isThere = CarouselUtils.getNearestIndex(position.value, count.value, getIsLooping()) === current;

            if (isThere && !isGliding.value) return;

            glideTo(current);
        });

        watch(
            () => progress.value,
            (next) => {
                if (isGliding.value) {
                    if (next === writtenProgress) return;

                    stopGlide?.();
                    isGliding.value = false;
                }

                const nearest = CarouselUtils.getNearestIndex(
                    CarouselUtils.toPosition(next, count.value, getIsLooping()),
                    count.value,
                    getIsLooping(),
                );

                if (nearest === currentIndex.value) return;

                index.value = nearest;

                void props.onIndexChange?.(nearest);
            },
        );

        const isRotating = computed(() =>
            CarouselUtils.getIsRotating({
                autoplayDelayMs: props.autoplayDelayMs,
                isPlaying: isPlaying.value,
                isHeld: isHeld.value,
                isSwiping: isSwiping.value,
                isDisabled: getIsDisabled(),
                count: count.value,
            }),
        );

        watchAfterRender(
            [isRotating, () => props.autoplayDelayMs, currentIndex],
            ([isTurning, autoplayDelayMs, current]) => {
                if (!isTurning || autoplayDelayMs === undefined) return;

                const advance = setTimeout(() => goTo(current + 1), autoplayDelayMs);

                return () => {
                    clearTimeout(advance);
                };
            },
        );

        let announcedIndex: number | undefined;

        watchAfterRender([currentIndex], ([current]) => {
            if (CarouselUtils.getIsAnnounced(announcedIndex, current, isRotating.value)) {
                LiveAnnouncerUtils.announce(props.computeSlideLabel(current, count.value));
            }

            announcedIndex = current;
        });

        const isPlaybackAtEnd = computed(() =>
            CarouselUtils.getIsPlaybackAtEnd({
                isLooping: getIsLooping(),
                autoplayDelayMs: props.autoplayDelayMs,
                isPlaying: isPlaying.value,
                isDisabled: getIsDisabled(),
                count: count.value,
                index: currentIndex.value,
            }),
        );

        watchAfterRender([isPlaybackAtEnd], ([isAtEnd]) => {
            if (isAtEnd) isPlaying.value = false;
        });

        const getSlideLabel = (slideIndex: number) => props.computeSlideLabel(slideIndex, count.value);

        const getDistance = (place: number) =>
            CarouselUtils.getDistance(place, ringPosition.value, ringCount.value, getIsLooping());

        const getSlideState = (place: number, face: CarouselFace): CarouselSlideState => ({
            index: toIndex(place),
            count: count.value,
            distance: getDistance(place),
            face,
            isCurrent: place === currentPlace.value,
        });

        const getIsStepRefused = (step: CarouselStep) =>
            CarouselUtils.getIsStepDisabled(step, currentIndex.value, count.value, getIsLooping(), getIsDisabled());

        const controls: CarouselControls = {
            getIndex: () => currentIndex.value,
            getCount: () => count.value,
            getIsPlaying: () => isPlaying.value,
            getIsHeld: () => isHeld.value,
            getCanStep: (step) => !getIsStepRefused(step),
            step: (step) => {
                if (getIsStepRefused(step)) return false;

                goTo(CarouselUtils.getStepTarget(step, currentIndex.value, count.value, getIsLooping()));

                return true;
            },
            pick: (pickIndex) => {
                if (getIsDisabled() || pickIndex < 0 || pickIndex >= count.value || pickIndex === currentIndex.value) {
                    return false;
                }

                goTo(pickIndex);

                return true;
            },
            setIsPlaying: (next) => {
                if (getIsDisabled() || next === isPlaying.value) return false;

                isPlaying.value = next;

                return true;
            },
            setIsHeldByPage: (next) => {
                if (next === isHeldByPage.value) return false;

                isHeldByPage.value = next;

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controls);
        });

        const handleViewportClick = (e: MouseEvent) => {
            if (getIsPressDisabled()) return;

            const current = currentPlace.value;
            const getDrawn = (place: number) => faceRefs[place]?.firstElementChild ?? faceRefs[place];

            if (getDrawn(current)?.contains(e.target as Node)) return;

            const rects = faceRefs.map((_face, place) =>
                place !== current && placements[place]?.effect.opacity !== CarouselConst.HIDDEN_OPACITY
                    ? getDrawn(place)?.getBoundingClientRect()
                    : undefined,
            );
            const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

            if (hit !== undefined) goTo(toIndex(hit));
        };

        return () => {
            const orientation = getOrientation();
            const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;
            const isTurnable = slots.renderSlideBack !== undefined;
            const isWindowed = getIsWindowed();

            const renderSlide = (place: number) => {
                const distance = getDistance(place);

                if (!CarouselUtils.getIsBuilt(distance, props.placement.reach, isWindowed)) {
                    faceRefs[place] = undefined;
                    placements[place] = undefined;

                    return undefined;
                }

                const slide = props.slides[toIndex(place)];
                const placement = props.placement.place({
                    distance,
                    index: place,
                    count: ringCount.value,
                    size: size.value,
                    orientation,
                    isLooping: getIsLooping(),
                });
                const isCurrent = place === currentPlace.value;

                placements[place] = placement;

                return (
                    <div
                        key={place}
                        class={CarouselStyles.carouselSlide}
                        style={CarouselUtils.toSlideStyle(placement, distance)}
                        role="group"
                        aria-roledescription={slideRoleDescription}
                        aria-label={getSlideLabel(toIndex(place))}
                        aria-hidden={isCurrent ? undefined : "true"}
                        inert={!isCurrent}
                    >
                        <div
                            ref={(element) => {
                                faceRefs[place] = element instanceof HTMLElement ? element : undefined;
                            }}
                            class={[CarouselStyles.carouselFace, isTurnable && CarouselStyles.carouselFaceTurnable]}
                        >
                            {callSlot(slots.renderSlide, { slide, state: getSlideState(place, "front") })}
                        </div>

                        {isTurnable && (
                            <div
                                class={[CarouselStyles.carouselFace, CarouselStyles.carouselFaceTurnable]}
                                style={{
                                    transform: CarouselUtils.getBackTransform(
                                        CarouselUtils.getTurnAxis(placement, orientation),
                                    ),
                                }}
                                aria-hidden="true"
                            >
                                {callSlot(slots.renderSlideBack, { slide, state: getSlideState(place, "back") })}
                            </div>
                        )}
                    </div>
                );
            };

            faceRefs.length = ringCount.value;
            placements.length = ringCount.value;

            return (
                <div
                    ref={rootRef}
                    class={CarouselStyles.carouselRoot}
                    role="region"
                    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                >
                    <div ref={viewportRef} class={CarouselStyles.carouselViewport} onClick={handleViewportClick}>
                        {Array.from({ length: ringCount.value }, (_, place) => renderSlide(place)).filter(
                            (slide) => slide !== undefined,
                        )}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Carousel",
        slots: Object as SlotsType<CarouselSlots<any>>,
        props: declareProps<CarouselProps<unknown>>({
            "autoplayDelayMs": null,
            "transitionDurationMs": null,
            "isDisabled": Boolean,
            "isLooping": Boolean,
            "isWindowed": Boolean,
            "ariaLabel": null,
            "computeSlideLabel": null,
            "roleDescription": null,
            "slideRoleDescription": null,
            "slides": null,
            "index": null,
            "onUpdate:index": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "progress": null,
            "onUpdate:progress": null,
            "onIndexChange": null,
            "orientation": null,
            "placement": null,
            "onMount": null,
        }),
    },
);
