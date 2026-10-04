import { type SlotsType, type VNodeChild, computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

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

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CarouselControlProps, CarouselControls, CarouselProps, CarouselSlots } from "./Carousel.types";

const NO_PROGRESS = 0;
const HIDDEN_OPACITY = 0;

const CarouselControl = defineComponent(
    (props: CarouselControlProps, { slots }: SlotsContext<InteractionControlSlots>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <button
                    type="button"
                    class={CarouselStyles.carouselControl}
                    aria-label={props.ariaLabel}
                    aria-disabled={isDisabled || undefined}
                    aria-current={props.isCurrent || undefined}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onActivate();
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        },
    {
        name: "CarouselControl",
        props: declareProps<CarouselControlProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            isCurrent: Boolean,
            onActivate: null,
        }),
    },
);

export const Carousel = defineComponent(
    <T,>(props: CarouselProps<T>, { slots }: SlotsContext<CarouselSlots<T>>) => {
        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const rootRef = shallowRef<HTMLDivElement>();
        const viewportRef = shallowRef<HTMLDivElement>();
        const swipeRatio = shallowRef(0);
        const isGliding = shallowRef(false);

        const index = useTwoWay(props, "index", 0);
        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", NO_PROGRESS);

        const faceRefs: (HTMLElement | undefined)[] = [];
        const placements: (CarouselPlacement | undefined)[] = [];

        const count = computed(() => props.slides.length);
        const currentIndex = computed(() => CarouselUtils.wrapIndex(index.value, count.value));
        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsLooping = () => props.isLooping ?? CAROUSEL_DEFAULTS.isLooping;
        const getOrientation = () => props.orientation ?? CAROUSEL_DEFAULTS.orientation;
        const getTransitionDurationMs = () => props.transitionDurationMs ?? CAROUSEL_DEFAULTS.transitionDurationMs;

        const isHeld = InteractionTrackerVueUtils.useHold(rootRef);

        const size = ElementObserverVueUtils.useBorderBoxSize(viewportRef);

        const position = computed(() => CarouselUtils.toPosition(progress.value, count.value, getIsLooping()));

        const getDrawnPosition = () => position.value - swipeRatio.value;

        const getIsPressDisabled = () =>
            CarouselUtils.getIsSwipeDisabled(slots.renderControls !== undefined, getIsDisabled(), count.value);

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

        const getDistance = (slideIndex: number) =>
            CarouselUtils.getDistance(slideIndex, getDrawnPosition(), count.value, getIsLooping());

        const getSlideState = (slideIndex: number, face: CarouselFace): CarouselSlideState => ({
            index: slideIndex,
            count: count.value,
            distance: getDistance(slideIndex),
            face,
            isCurrent: slideIndex === currentIndex.value,
        });

        const renderStepControl = (step: CarouselStep): VNodeChild => {
            const targetIndex = CarouselUtils.getStepTarget(step, currentIndex.value, count.value, getIsLooping());

            return (
                <InteractionWrapper
                    key={step}
                    isDisabled={CarouselUtils.getIsStepDisabled(
                        step,
                        currentIndex.value,
                        count.value,
                        getIsLooping(),
                        getIsDisabled(),
                    )}
                    extraFlags={{ step, targetIndex }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags: renderProps }) => (
                                <CarouselControl
                                    ref={setElementRef}
                                    isCurrent={false}
                                    ariaLabel={props.computeStepLabel(step)}
                                    flags={renderProps}
                                    onActivate={() => goTo(targetIndex)}
                                >
                                    {{ renderContent: () => callSlot(slots.renderStep, { step, renderProps }) }}
                                </CarouselControl>
                            ),
                        } satisfies InteractionWrapperSlots<CarouselStepRenderProps>
                    }
                </InteractionWrapper>
            );
        };

        const renderPickControl = (pickIndex: number): VNodeChild => (
            <InteractionWrapper
                key={pickIndex}
                isDisabled={getIsDisabled()}
                extraFlags={{ index: pickIndex, isCurrent: pickIndex === currentIndex.value }}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags: renderProps }) => (
                            <CarouselControl
                                ref={setElementRef}
                                isCurrent={renderProps.isCurrent}
                                ariaLabel={getSlideLabel(pickIndex)}
                                flags={renderProps}
                                onActivate={() => goTo(pickIndex)}
                            >
                                {{
                                    renderContent: () => callSlot(slots.renderPick, { index: pickIndex, renderProps }),
                                }}
                            </CarouselControl>
                        ),
                    } satisfies InteractionWrapperSlots<CarouselPickRenderProps>
                }
            </InteractionWrapper>
        );

        const renderRotationControl = (): VNodeChild => (
            <InteractionWrapper
                key="rotation"
                isDisabled={getIsDisabled()}
                extraFlags={{ isPlaying: isPlaying.value, isHeld: isHeld.value }}
            >
                {
                    {
                        renderControl: ({ setElementRef, flags }) => (
                            <CarouselControl
                                ref={setElementRef}
                                isCurrent={false}
                                ariaLabel={props.computeRotationLabel(isPlaying.value)}
                                flags={flags}
                                onActivate={() => {
                                    isPlaying.value = !isPlaying.value;
                                }}
                            >
                                {{ renderContent: () => callSlot(slots.renderRotationControl, flags) }}
                            </CarouselControl>
                        ),
                    } satisfies InteractionWrapperSlots<CarouselRotationFlags>
                }
            </InteractionWrapper>
        );

        const handleViewportClick = (e: MouseEvent) => {
            if (getIsPressDisabled()) return;

            const current = currentIndex.value;
            const getDrawn = (slideIndex: number) => faceRefs[slideIndex]?.firstElementChild ?? faceRefs[slideIndex];

            if (getDrawn(current)?.contains(e.target as Node)) return;

            const rects = faceRefs.map((_face, slideIndex) =>
                slideIndex !== current && placements[slideIndex]?.effect.opacity !== HIDDEN_OPACITY
                    ? getDrawn(slideIndex)?.getBoundingClientRect()
                    : undefined,
            );
            const hit = CarouselUtils.computeHitIndex(rects, { x: e.clientX, y: e.clientY });

            if (hit !== undefined) goTo(hit);
        };

        return () => {
            const orientation = getOrientation();
            const slideRoleDescription = props.slideRoleDescription ?? CAROUSEL_DEFAULTS.slideRoleDescription;
            const isTurnable = slots.renderSlideBack !== undefined;

            const controls: CarouselControls = {
                index: currentIndex.value,
                count: count.value,
                isPlaying: isPlaying.value,
                isHeld: isHeld.value,
                renderStep: renderStepControl,
                renderPick: renderPickControl,
                renderRotationControl,
            };

            const renderSlide = (slide: T, slideIndex: number) => {
                const distance = getDistance(slideIndex);
                const placement = props.computePlacement({
                    distance,
                    index: slideIndex,
                    count: count.value,
                    size: size.value,
                    orientation,
                    isLooping: getIsLooping(),
                });
                const isCurrent = slideIndex === currentIndex.value;

                placements[slideIndex] = placement;

                return (
                    <div
                        key={slideIndex}
                        class={CarouselStyles.carouselSlide}
                        style={CarouselUtils.toSlideStyle(placement, distance)}
                        role="group"
                        aria-roledescription={slideRoleDescription}
                        aria-label={getSlideLabel(slideIndex)}
                        aria-hidden={isCurrent ? undefined : "true"}
                        inert={!isCurrent}
                    >
                        <div
                            ref={(element) => {
                                faceRefs[slideIndex] = element instanceof HTMLElement ? element : undefined;
                            }}
                            class={[CarouselStyles.carouselFace, isTurnable && CarouselStyles.carouselFaceTurnable]}
                        >
                            {callSlot(slots.renderSlide, { slide, state: getSlideState(slideIndex, "front") })}
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
                                {callSlot(slots.renderSlideBack, { slide, state: getSlideState(slideIndex, "back") })}
                            </div>
                        )}
                    </div>
                );
            };

            faceRefs.length = count.value;
            placements.length = count.value;

            return (
                <div
                    ref={rootRef}
                    class={CarouselStyles.carouselRoot}
                    style={{ gap: `${props.gap ?? CAROUSEL_DEFAULTS.gap}px` }}
                    role="region"
                    aria-roledescription={props.roleDescription ?? CAROUSEL_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                >
                    <div ref={viewportRef} class={CarouselStyles.carouselViewport} onClick={handleViewportClick}>
                        {props.slides.map((slide, slideIndex) => renderSlide(slide, slideIndex))}
                    </div>

                    {callSlot(slots.renderControls, controls)}
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
            "gap": null,
            "isDisabled": Boolean,
            "isLooping": Boolean,
            "ariaLabel": null,
            "computeSlideLabel": null,
            "computeStepLabel": null,
            "computeRotationLabel": null,
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
            "computePlacement": null,
        }),
    },
);
